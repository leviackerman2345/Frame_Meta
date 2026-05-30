import { Metadata } from 'next';
import { getClipFeed } from '@/lib/clips';
import ClipFeed from '@/components/clips/ClipFeed';
import { Clip } from '@/types/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Clips — FrameMeta',
  description: 'Watch short clips from your favorite movies and series',
};

export default async function ClipsPage() {
  let clips: Clip[] = [];

  try {
    clips = await getClipFeed({ page: 0, limit: 10 });
  } catch (error) {
    // on error pass empty array to <ClipFeed> so page never crashes
    console.error('Failed to load initial clips:', error);
    clips = [];
  }

  // Passing initialClips to the client component ensures a fast server-side first load,
  // improving perceived performance and SEO while allowing the client to handle further pagination.
  return (
    <ClipFeed initialClips={clips} />
  );
}
