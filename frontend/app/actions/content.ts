"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSiteContent(page: string, section: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('page', page)
    .eq('section', section)
    .single();

  if (error || !data) {
    return null;
  }

  return data.content;
}

export async function updateSiteContent(page: string, section: string, content: any) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('erp_profile_id')?.value;

  if (!isAdmin) {
    throw new Error('Unauthorized');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin updates
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('site_content')
    .upsert(
      { page, section, content },
      { onConflict: 'page, section' }
    )
    .select()
    .single();

  if (error) {
    console.error("Error updating site content:", error);
    throw new Error('Failed to update content');
  }

  return data;
}
