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

    // 1. Total products in catalog
    const { count: totalProducts } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // 2. Total registered users / profiles
    const { count: totalUsers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 3. Circle members
    const { count: circleMembers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_circle_member", true);

    // 4. Newsletter subscribers
    const { count: newsletterSubs } = await supabaseAdmin
      .from("newsletter_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "subscribed");

    // 5. Recent activity: latest 8 profiles
    const { data: recentProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, created_at, is_circle_member, circle_tier")
      .order("created_at", { ascending: false })
      .limit(8);

    // 6. Concierge / customization requests
    const { count: openRequests } = await supabaseAdmin
      .from("customization_requests")
      .select("*", { count: "exact", head: true })
      .not("status", "eq", "delivered")
      .not("status", "eq", "cancelled");

    // 7. Orders with line items and profiles
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

    // Build 24-hour breakdown template
    const buildHourlyTemplate = () =>
      Array.from({ length: 24 }, (_, h) => ({
        hour: h,
        label: `${String(h).padStart(2, "0")}:00`,
        totalCents: 0,
        orderCount: 0,
      }));

    // Build day-level summary
    const buildDaySummary = (targetDateStr: string, label: string) => {
      const dayOrders = allOrders.filter(
        (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === targetDateStr
      );

      const hourlyMap = buildHourlyTemplate();

      let totalCents = 0;
      let paidCount = 0;

      dayOrders.forEach((o) => {
        const isPaid = ["paid", "processing", "shipped", "delivered"].includes(o.status);
        if (o.status !== "cancelled") {
          totalCents += o.total_cents || 0;
        }
        if (isPaid) {
          paidCount++;
        }
        const hour = getMexicoHour(o.placed_at || o.created_at);
        if (hourlyMap[hour]) {
          hourlyMap[hour].orderCount += 1;
          if (o.status !== "cancelled") {
            hourlyMap[hour].totalCents += o.total_cents || 0;
          }
        }
      });

      const orderCount = dayOrders.length;
      const averageTicketCents = orderCount > 0 ? Math.round(totalCents / orderCount) : 0;

      return {
        dateStr: targetDateStr,
        label,
        totalCents,
        orderCount,
        paidCount,
        averageTicketCents,
        orders: dayOrders.map(formatOrder),
        chartData: hourlyMap,
      };
    };

    // 1. Today's sales
    const todaySales = buildDaySummary(todayStr, "Hoy");

    // 2. Yesterday's sales
    const yesterdaySales = buildDaySummary(yesterdayStr, "Ayer");

    // 3. Last 7 Days summary
    const past7DaysData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dStr = getMexicoDateStr(d);
      const dayShort = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        weekday: "short",
        day: "numeric",
      }).format(d);

      const dayOrders = allOrders.filter(
        (o) => getMexicoDateStr(new Date(o.placed_at || o.created_at)) === dStr
      );

      const totalCents = dayOrders.reduce(
        (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
        0
      );

      return {
        dateStr: dStr,
        label: dayShort,
        totalCents,
        orderCount: dayOrders.length,
      };
    });

    const weekOrders = allOrders.filter((o) => {
      const orderDate = new Date(o.placed_at || o.created_at);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= sevenDaysAgo;
    });

    const weekTotalCents = weekOrders.reduce(
      (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
      0
    );

    const weekSales = {
      label: "Últimos 7 Días",
      totalCents: weekTotalCents,
      orderCount: weekOrders.length,
      paidCount: weekOrders.filter((o) =>
        ["paid", "processing", "shipped", "delivered"].includes(o.status)
      ).length,
      averageTicketCents: weekOrders.length > 0 ? Math.round(weekTotalCents / weekOrders.length) : 0,
      orders: weekOrders.map(formatOrder),
      chartData: past7DaysData,
    };

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts ?? 0,
        totalUsers: totalUsers ?? 0,
        circleMembers: circleMembers ?? 0,
        newsletterSubs: newsletterSubs ?? 0,
        openRequests: openRequests ?? 0,
        allTimeRevenueCents: allOrders.reduce(
          (sum, o) => (o.status !== "cancelled" ? sum + (o.total_cents || 0) : sum),
          0
        ),
        allTimeOrdersCount: allOrders.length,
      },
      sales: {
        currentDateMexico: todayStr,
        today: todaySales,
        yesterday: yesterdaySales,
        week: weekSales,
      },
      recentActivity: (recentProfiles ?? []).map((p) => ({
        id: p.id,
        user: p.full_name || p.email?.split("@")[0] || "Usuario",
        email: p.email,
        isCircle: p.is_circle_member ?? false,
        tier: p.circle_tier,
        joinedAt: p.created_at,
        action: p.is_circle_member
          ? "Se unió a The Circle"
          : "Se registró en el Atelier",
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
