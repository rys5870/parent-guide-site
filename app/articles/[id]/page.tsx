import ArticleDetails from '@/components/ArticleDetails';
import ArticleList from '@/components/ArticleList'
import React from 'react'
type Props = {
  params: { id: string };
};


const page = ({params}:Props) => {

  return (
    <div>
     <ArticleDetails id={'1'} title={'a'} topic={'b'} content={'c'} readTime={''} createdAt={''} imageUrl={'/logo.png'}/>
      
    </div>
  )
}

export default page