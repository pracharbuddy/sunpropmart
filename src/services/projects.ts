import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, ProjectCategory } from '../types';
import { SEED_PROJECTS } from '../data/seedData';
import { logAudit } from './audit';

export async function getProjects(category?: string): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    if (category && category !== 'all') {
      return SEED_PROJECTS.filter((p) => p.project_type === category);
    }
    return SEED_PROJECTS;
  }

  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('project_type', category);
    }

    const { data, error } = await query;
    if (error || !data) {
      return SEED_PROJECTS;
    }
    return data as Project[];
  } catch {
    return SEED_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    return SEED_PROJECTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return SEED_PROJECTS.find((p) => p.slug === slug) || null;
    }
    return data as Project;
  } catch {
    return SEED_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

export async function createProject(
  projectData: Partial<Project>,
  operatorId?: string
): Promise<{ project: Project | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { project: null, error: 'Database is not connected.' };
  }

  try {
    const seq = Date.now().toString().slice(-4);
    const slug = (projectData.name || `Project ${seq}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const payload: any = {
      ...projectData,
      project_id: projectData.project_id || `SPM-PRJ-${seq}`,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (payload.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id)) {
      delete payload.id;
    }

    const { data, error } = await supabase.from('projects').insert(payload).select().single();
    if (error) return { project: null, error: error.message };

    await logAudit('PROJECT_CREATED', 'projects', data.id, null, { name: data.name }, operatorId);
    return { project: data as Project, error: null };
  } catch (err: any) {
    return { project: null, error: err.message };
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<Project>,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    await logAudit('PROJECT_UPDATED', 'projects', id, null, projectData, operatorId);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProject(id: string, operatorId?: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    await logAudit('PROJECT_DELETED', 'projects', id, null, null, operatorId);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
