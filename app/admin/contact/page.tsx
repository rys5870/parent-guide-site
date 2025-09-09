import React from 'react'
import Container from '@/components/Container'
import PageTitle from '@/components/PageTitle'
import AdminContact from '@/components/adminComponents/AdminContact'
function page() {

  return (
    <div>
        <PageTitle text='הודעות'/>
        <Container>
        <AdminContact/>
        </Container>
    </div>
  )
}

export default page