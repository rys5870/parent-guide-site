"use client";
import ContentList from '@/components/adminComponents/ContactList'
import StatusSelector from '@/components/adminComponents/StatusSelector'

import { useState } from 'react'

const AdminContact = () => {
     const [selectedStatus, setSelectedStatus] = useState<string | null>("not-treated-or-empty");
    const onHandleStatus = (status: string) => {
  setSelectedStatus(status);}
  return (
    
    <div>
          <StatusSelector handleStatus={onHandleStatus}/>
                <ContentList status={selectedStatus}/>
    </div>
  )
}

export default AdminContact