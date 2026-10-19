import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/profiles';

export type AdminUser = {
  id: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
};

export type AdminEvent = {
  id: string;
  code: string;
  title: string;
  startsAt: string;
  endsAt: string;
  createdBy: string;
  attendeeCount: number;
};

export type AdminAttendance = {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  scannedAt: string;
};

export type AdminData = {
  users: AdminUser[];
  events: AdminEvent[];
  attendance: AdminAttendance[];
};

export async function getAdminData(): Promise<AdminData> {
  const [usersResult, eventsResult, attendanceResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('events')
      .select('id, code, title, starts_at, ends_at, created_by, attendance(count)')
      .order('starts_at', { ascending: false }),
    supabase
      .from('attendance')
      .select('id, event_id, student_id, scanned_at, profiles!inner(full_name), events!inner(title)')
      .order('scanned_at', { ascending: false }),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (eventsResult.error) throw eventsResult.error;
  if (attendanceResult.error) throw attendanceResult.error;

  return {
    users: (usersResult.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      role: row.role as UserRole,
      createdAt: row.created_at,
    })),
    events: (eventsResult.data ?? []).map((row) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      createdBy: row.created_by,
      attendeeCount: row.attendance?.[0]?.count ?? 0,
    })),
    attendance: (attendanceResult.data ?? []).map((row) => ({
      id: row.id,
      eventId: row.event_id,
      eventTitle: row.events[0]?.title ?? 'Unknown event',
      studentId: row.student_id,
      studentName: row.profiles[0]?.full_name ?? 'Unknown student',
      scannedAt: row.scanned_at,
    })),
  };
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id')
    .single();
  if (error) throw error;
}

export async function updateEventDetails(
  eventId: string,
  title: string,
  code: string
): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ title: title.trim(), code: code.trim() })
    .eq('id', eventId)
    .select('id')
    .single();
  if (error) throw error;
}

export async function deleteAdminEvent(eventId: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', eventId).select('id').single();
  if (error) throw error;
}

export async function updateAttendanceTime(attendanceId: string, scannedAt: string): Promise<void> {
  const date = new Date(scannedAt);
  if (Number.isNaN(date.getTime())) throw new Error('Enter a valid date and time.');

  const { error } = await supabase
    .from('attendance')
    .update({ scanned_at: date.toISOString() })
    .eq('id', attendanceId)
    .select('id')
    .single();
  if (error) throw error;
}

export async function deleteAttendanceRecord(attendanceId: string): Promise<void> {
  const { error } = await supabase.from('attendance').delete().eq('id', attendanceId).select('id').single();
  if (error) throw error;
}
