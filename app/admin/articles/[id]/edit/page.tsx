'use client';
import EditArticle from '@/components/adminComponents/EditArticle';
import { useParams } from 'next/navigation';

export default function EditArticlePage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id || typeof id !== 'string') {
    return <p className="text-center text-red-500 mt-10">מזהה מאמר לא תקף</p>;
  }

  return (
    <div>
   
      <EditArticle articleID={id}  />
    </div>
  );
}