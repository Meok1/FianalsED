import { supabase } from '@/lib/supabase';

export type Event = {
  id: string;
  code: string;
  title: string;
  starts_at: string;
  ends_at: string;
  created_by: string;
  created_at: string;
};

export type CreateEventInput = {
  code: string;
  title: string;
  startsAt: string;
  endsAt: string;
  createdBy: string;
};

export async function createEvent(input: CreateEventInput): Promise<Event> {
  if (!input.createdBy) {
    throw new Error('No signed-in user was found. Sign out and sign in again.');
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      code: input.code,
      title: input.title,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      created_by: input.createdBy,
    })
    .select()
    .single();
  if (error?.code === '42501') {
    throw new Error('Your Supabase profile is not marked as teacher. Run the role update SQL, then sign in again.');
  }
  if (error?.code === '23505') {
    throw new Error('This event code already exists. Choose a different code.');
  }
  if (error?.code === '42P01' || error?.code === 'PGRST205') {
    throw new Error('The events table is missing in Supabase. Open the Supabase SQL Editor and run supabase/schema.sql.');
  }
  if (error) {
    throw new Error(`Supabase could not create the event (${error.code ?? 'unknown'}): ${error.message}`);
  }
  return data as Event;
}

export async function getEventByCode(code: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('code', code)
    .maybeSingle();
  if (error) throw error;
  return data as Event | null;
}

export async function getTeacherEvents(teacherId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('created_by', teacherId)
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Event[];
}

export async function deleteEvent(eventId: string, teacherId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('created_by', teacherId);
  if (error) throw error;
}