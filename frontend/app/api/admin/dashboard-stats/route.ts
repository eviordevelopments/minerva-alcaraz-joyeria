import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Helper to extract YYYY-MM-DD in America/Mexico_City */
function getMexicoDateStr(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Helper to extract 0-23 hour in America/Mexico_City */
function getMexicoHour(dateStr: string): number {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      hour: "numeric",
      hour12: false,
    }).format(new Date(dateStr)),
    10
  );
}

/** Helper to format time as "HH:mm:ss" in America/Mexico_City */
function getMexicoTimeFormatted(dateStr: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(dateStr));
}

export async function GET() {
  try {
    const now = new Date();
    const todayStr = getMexicoDateStr(now);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = getMexicoDateStr(yesterday);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // 1. Total active products in catalog
    const { count: totalProducts } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // 2. Fetch profiles with timestamps
    const { data: rawProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, created_at, is_circle_member, circle_tier")
      .order("created_at", { ascending: false });
    const allProfiles = rawProfiles || [];

    // 3. Fetch newsletter subscriptions with timestamps
    const { data: rawNewsletter } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("id, created_at, status");
    const allNewsletter = rawNewsletter || [];

    // 4. Fetch customization/concierge requests with timestamps
    const { data: rawRequests } = await supabaseAdmin
      .from("customization_requests")
      .select("id, created_at, status");
    const allRequests = rawRequests || [];

    // 5. Fetch orders with line items and profiles
    const { data: rawOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_method,
        total_cents,
        subtotal_cents,
        shipping_cents,
        discount_cents,
        placed_at,
        created_at,
        shipping_name,
        shipping_email,
        profiles (
          full_name,
          email,
          is_circle_member,
          circle_tier
        ),
        order_items (
          id,
          product_name,
          product_sku,
          quantity,
          subtotal_cents
        )
      `)
      .order("placed_at", { ascending: false });

    if (ordersError) {
      console.warn("Notice fetching orders for dashboard:", ordersError.message);
    }
    const allOrders = rawOrders || [];

    // Helper to format order row for UI
    const formatOrder = (o: any) => {
      const items = Array.isArray(o.order_items) ? o.order_items : [];
      const totalPieces = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
      const itemsSummary =
        items.length > 0
          ? items.map((it: any) => `${it.product_name} (x${it.quantity || 1})`).join(", ")
          : "Sin desglose";

      return {
        id: o.id,
        orderNumber: o.order_number || `ORD-${o.id.slice(0, 8)}`,
        placedAt: o.placed_at || o.created_at,
        timeFormatted: getMexicoTimeFormatted(o.placed_at || o.created_at),
        customerName: o.shipping_name || o.profiles?.full_name || "Cliente Invitado",
        customerEmail: o.shipping_email || o.profiles?.email || "Sin correo",
        isCircle: Boolean(o.profiles?.is_circle_member),
        circleTier: o.profiles?.circle_tier || null,
        itemsCount: totalPieces,
        itemsSummary,
        totalCents: o.total_cents ?? 0,
        subtotalCents: o.subtotal_cents ?? 0,
        shippingCents: o.shipping_cents ?? 0,
        status: o.status ?? "pending",
        paymentMethod: o.payment_method ?? "card",
      };
    };

    // ── 1. DIARIO (HOY) ───────────────────────────────────────────────────
    const todayOrders = allOrders.filter(
      (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === todayStr
    );
    const todayHourlyMap = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, "0")}:00`,
      totalCents: 0,
      orderCount: 0,
    }));
    let todayTotalCents = 0;
    let todayPaidCount = 0;
    todayOrders.forEach((o) => {
      if (o.status !== "cancelled") todayTotalCents += o.total_cents || 0;
      if (["paid", "processing", "shipped", "delivered"].includes(o.status)) todayPaidCount++;
      const h = getMexicoHour(o.placed_at || o.created_at);
      if (todayHourlyMap[h]) {
        todayHourlyMap[h].orderCount++;
        if (o.status !== "cancelled") todayHourlyMap[h].totalCents += o.total_cents || 0;
      }
    });

    const diarioSales = {
      label: "Hoy",
      subLabel: "Jornada en Directo · 00:00 a 23:00 hrs",
      totalCents: todayTotalCents,
      orderCount: todayOrders.length,
      paidCount: todayPaidCount,
      averageTicketCents: todayOrders.length > 0 ? Math.round(todayTotalCents / todayOrders.length) : 0,
      orders: todayOrders.map(formatOrder),
      chartData: todayHourlyMap,
    };

    // ── 1b. DIARIO (AYER) ──────────────────────────────────────────────────
    const yesterdayOrders = allOrders.filter(
      (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === yesterdayStr
    );
    const yesterdayHourlyMap = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, "0")}:00`,
      totalCents: 0,
      orderCount: 0,
    }));
    let yesterdayTotalCents = 0;
    let yesterdayPaidCount = 0;
    yesterdayOrders.forEach((o) => {
      if (o.status !== "cancelled") yesterdayTotalCents += o.total_cents || 0;
      if (["paid", "processing", "shipped", "delivered"].includes(o.status)) yesterdayPaidCount++;
      const h = getMexicoHour(o.placed_at || o.created_at);
      if (yesterdayHourlyMap[h]) {
        yesterdayHourlyMap[h].orderCount++;
        if (o.status !== "cancelled") yesterdayHourlyMap[h].totalCents += o.total_cents || 0;
      }
    });

    const yesterdaySales = {
      label: "Ayer",
      subLabel: "Jornada Anterior Completa",
      totalCents: yesterdayTotalCents,
      orderCount: yesterdayOrders.length,
      paidCount: yesterdayPaidCount,
      averageTicketCents: yesterdayOrders.length > 0 ? Math.round(yesterdayTotalCents / yesterdayOrders.length) : 0,
      orders: yesterdayOrders.map(formatOrder),
      chartData: yesterdayHourlyMap,
    };

    // ── 2. SEMANAL (ÚLTIMOS 7 DÍAS) ────────────────────────────────────────
    const weekOrders = allOrders.filter(
      (o) => new Date(o.placed_at || o.created_at) >= sevenDaysAgo
    );
    const weekChartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dStr = getMexicoDateStr(d);
      const dayLabel = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        weekday: "short",
        day: "numeric",
      }).format(d);

      const dayOrders = weekOrders.filter(
        (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === dStr
      );
      const totalCents = dayOrders.reduce(
        (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
        0
      );

      return {
        label: dayLabel,
        dateStr: dStr,
        totalCents,
        orderCount: dayOrders.length,
      };
    });

    const weekTotalCents = weekOrders.reduce(
      (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
      0
    );

    const semanalSales = {
      label: "Semana",
      subLabel: "Últimos 7 Días",
      totalCents: weekTotalCents,
      orderCount: weekOrders.length,
      paidCount: weekOrders.filter((o) =>
        ["paid", "processing", "shipped", "delivered"].includes(o.status)
      ).length,
      averageTicketCents: weekOrders.length > 0 ? Math.round(weekTotalCents / weekOrders.length) : 0,
      orders: weekOrders.map(formatOrder),
      chartData: weekChartData,
    };

    // ── 3. MENSUAL (ÚLTIMOS 30 DÍAS) ───────────────────────────────────────
    const monthOrders = allOrders.filter(
      (o) => new Date(o.placed_at || o.created_at) >= thirtyDaysAgo
    );
    const monthChartData = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dStr = getMexicoDateStr(d);
      const dayNum = String(d.getDate());
      const monthShort = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        month: "short",
      }).format(d);

      const dayOrders = monthOrders.filter(
        (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === dStr
      );
      const totalCents = dayOrders.reduce(
        (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
        0
      );

      return {
        label: `${dayNum} ${monthShort}`,
        dateStr: dStr,
        totalCents,
        orderCount: dayOrders.length,
      };
    });

    const monthTotalCents = monthOrders.reduce(
      (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
      0
    );

    const mensualSales = {
      label: "Mes",
      subLabel: "Últimos 30 Días",
      totalCents: monthTotalCents,
      orderCount: monthOrders.length,
      paidCount: monthOrders.filter((o) =>
        ["paid", "processing", "shipped", "delivered"].includes(o.status)
      ).length,
      averageTicketCents: monthOrders.length > 0 ? Math.round(monthTotalCents / monthOrders.length) : 0,
      orders: monthOrders.map(formatOrder),
      chartData: monthChartData,
    };

    // ── 4. ANUAL (ÚLTIMOS 12 MESES) ────────────────────────────────────────
    const yearOrders = allOrders.filter(
      (o) => new Date(o.placed_at || o.created_at) >= oneYearAgo
    );
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const yearChartData = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const targetYear = d.getFullYear();
      const targetMonth = d.getMonth();
      const label = `${monthNames[targetMonth]} ${String(targetYear).slice(2)}`;

      const monthMatches = yearOrders.filter((o) => {
        const od = new Date(o.placed_at || o.created_at);
        return od.getFullYear() === targetYear && od.getMonth() === targetMonth;
      });

      const totalCents = monthMatches.reduce(
        (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
        0
      );

      return {
        label,
        dateStr: `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}`,
        totalCents,
        orderCount: monthMatches.length,
      };
    });

    const yearTotalCents = yearOrders.reduce(
      (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
      0
    );

    const anualSales = {
      label: "Año",
      subLabel: "Últimos 12 Meses",
      totalCents: yearTotalCents,
      orderCount: yearOrders.length,
      paidCount: yearOrders.filter((o) =>
        ["paid", "processing", "shipped", "delivered"].includes(o.status)
      ).length,
      averageTicketCents: yearOrders.length > 0 ? Math.round(yearTotalCents / yearOrders.length) : 0,
      orders: yearOrders.map(formatOrder),
      chartData: yearChartData,
    };

    // ── PERIOD AGGREGATES FOR CARDS ────────────────────────────────────────
    const filterByDate = (list: any[], cutoff: Date) =>
      list.filter((x) => new Date(x.created_at) >= cutoff).length;

    const startOfTodayUtc = new Date(`${todayStr}T00:00:00-06:00`);

    const periods = {
      Diario: {
        sales: diarioSales,
        usersCount: filterByDate(allProfiles, startOfTodayUtc),
        newsletterCount: filterByDate(allNewsletter, startOfTodayUtc),
        conciergeCount: filterByDate(allRequests, startOfTodayUtc),
        activeDescription: "Registrados hoy (CDMX)",
      },
      Semanal: {
        sales: semanalSales,
        usersCount: filterByDate(allProfiles, sevenDaysAgo),
        newsletterCount: filterByDate(allNewsletter, sevenDaysAgo),
        conciergeCount: filterByDate(allRequests, sevenDaysAgo),
        activeDescription: "En los últimos 7 días",
      },
      Mensual: {
        sales: mensualSales,
        usersCount: filterByDate(allProfiles, thirtyDaysAgo),
        newsletterCount: filterByDate(allNewsletter, thirtyDaysAgo),
        conciergeCount: filterByDate(allRequests, thirtyDaysAgo),
        activeDescription: "En los últimos 30 días",
      },
      Anual: {
        sales: anualSales,
        usersCount: filterByDate(allProfiles, oneYearAgo),
        newsletterCount: filterByDate(allNewsletter, oneYearAgo),
        conciergeCount: filterByDate(allRequests, oneYearAgo),
        activeDescription: "En los últimos 12 meses",
      },
    };

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts ?? 0,
        totalUsers: allProfiles.length,
        circleMembers: allProfiles.filter((p) => p.is_circle_member).length,
        newsletterSubs: allNewsletter.filter((n) => n.status === "subscribed").length,
        openRequests: allRequests.filter(
          (r) => r.status !== "delivered" && r.status !== "cancelled"
        ).length,
        allTimeRevenueCents: allOrders.reduce(
          (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
          0
        ),
        allTimeOrdersCount: allOrders.length,
      },
      periods,
      yesterdaySales,
      recentActivity: allProfiles.slice(0, 8).map((p) => ({
        id: p.id,
        user: p.full_name || p.email?.split("@")[0] || "Usuario",
        email: p.email,
        isCircle: p.is_circle_member ?? false,
        tier: p.circle_tier,
        joinedAt: p.created_at,
        action: p.is_circle_member ? "Se unió a The Circle" : "Se registró en el Atelier",
      })),
      currentDateMexico: todayStr,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
