/**
 * DreamX Server-Side Service Catalogue & Price Authority
 * Adheres to PRD §6.1 & §19.1:
 * - Server-side price records in integer paise.
 * - Client NEVER submits a final price.
 * - Each service defines duration, deliverable, and 48h SLA guarantee.
 */

import { createClient } from './supabase/client';
import { formatINR, paiseToRupees } from './money';
import { SERVICES as STATIC_SERVICES, type Service } from '@/data/services';

export interface ServerServiceRecord {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "Resume & Profile" | "Interview Prep" | "Career Strategy";
  durationMinutes: number;
  durationLabel: string;
  listPaise: number;
  priceRupees: number;
  formattedPriceINR: string;
  deliverable: string;
  slaHours: number;
  format: "1:1 Live Simulation" | "Async Video & PDF" | "1:1 Live Consultation";
  popular?: boolean;
  prerequisites: string[];
  rubricCriteria: string[];
}

/**
 * Fetch all services from authoritative Supabase database, falling back gracefully to static records.
 */
export async function getAuthoritativeServices(): Promise<ServerServiceRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('code', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        code: row.code,
        slug: row.slug,
        title: row.title,
        shortDescription: row.short_description,
        fullDescription: row.full_description,
        category: row.category as ServerServiceRecord['category'],
        durationMinutes: row.duration_minutes,
        durationLabel: `${row.duration_minutes} min`,
        listPaise: Number(row.list_paise),
        priceRupees: paiseToRupees(Number(row.list_paise)),
        formattedPriceINR: formatINR(Number(row.list_paise)),
        deliverable: row.deliverable,
        slaHours: row.sla_hours,
        format: row.format as ServerServiceRecord['format'],
        popular: Boolean(row.popular),
        prerequisites: row.prerequisites || [],
        rubricCriteria: row.rubric_criteria || [],
      }));
    }
  } catch (err) {
    console.warn('Fallback to static services due to network/client error:', err);
  }

  // Fallback to static services formatted into paise
  return STATIC_SERVICES.map((srv: Service) => {
    const listPaise = srv.price * 100;
    return {
      id: srv.id,
      code: srv.code,
      slug: srv.slug,
      title: srv.title,
      shortDescription: srv.shortDescription,
      fullDescription: srv.fullDescription,
      category: srv.category,
      durationMinutes: parseInt(srv.duration, 10) || 45,
      durationLabel: srv.duration,
      listPaise,
      priceRupees: srv.price,
      formattedPriceINR: formatINR(listPaise),
      deliverable: srv.deliverable,
      slaHours: 48,
      format: srv.format,
      popular: srv.popular,
      prerequisites: srv.prerequisites,
      rubricCriteria: srv.rubricCriteria,
    };
  });
}

/**
 * Fetch single service by slug with authoritative server price.
 */
export async function getAuthoritativeServiceBySlug(
  slug: string
): Promise<ServerServiceRecord | null> {
  const all = await getAuthoritativeServices();
  return all.find((s) => s.slug === slug) || null;
}
