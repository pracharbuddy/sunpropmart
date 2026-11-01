import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BlogPost } from '../types';
import { SEED_BLOG_POSTS } from '../data/seedData';
import { logAudit } from './audit';

export async function getPosts(category?: string): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    if (category && category !== 'all') {
      return SEED_BLOG_POSTS.filter((p) => p.category === category);
    }
    return SEED_BLOG_POSTS;
  }

  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return SEED_BLOG_POSTS;
    }
    return data as BlogPost[];
  } catch {
    return SEED_BLOG_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) {
    return SEED_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return SEED_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }
    return data as BlogPost;
  } catch {
    return SEED_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }
}

export async function createPost(
  postData: Partial<BlogPost>,
  operatorId?: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { post: null, error: 'Database is not connected.' };
  }

  try {
    const slug = (postData.title || `Post ${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const payload: any = {
      ...postData,
      slug,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (payload.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id)) {
      delete payload.id;
    }

    const { data, error } = await supabase.from('posts').insert(payload).select().single();
    if (error) return { post: null, error: error.message };

    await logAudit('POST_CREATED', 'posts', data.id, null, { title: data.title }, operatorId);
    return { post: data as BlogPost, error: null };
  } catch (err: any) {
    return { post: null, error: err.message };
  }
}
