'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ContentItem from './ContactItem'

interface ContentProps {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  isDelete: boolean
  status: string
}

interface ContentListProps {
  status: string | null;
}

const ContactList = ({ status }: ContentListProps) => {
  const [loading, setLoading] = useState(false)
  const [contents, setContents] = useState<ContentProps[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ContentProps[]>('/api/contact')
      setContents(response.data)
    } catch (error) {
      console.error('שגיאה בשליפת הפרטים:', error)
      toast.error('אירעה שגיאה בעת טעינת הפרטים')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  const filteredContents = contents.filter((item) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phone.includes(search) ||
      item.message.toLowerCase().includes(search)

    const matchesStatus =
      !status ||
      (status === 'not-treated-or-empty'
        ? item.status === 'לא טופל' || !item.status || item.status === ''
        : item.status === status)

    return matchesStatus && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 חפש לפי שם, אימייל, טלפון או הודעה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-blue-600">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
          <p className="text-sm font-medium">טוען נתונים...</p>
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          <p className="text-lg font-medium">לא נמצאו תוצאות מתאימות.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContents.map((item) => (
            <ContentItem key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactList