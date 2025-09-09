import { Clock, Mail, Map, Phone } from 'lucide-react'
import React from 'react'
interface ContactItemData{
     title:string,
        subtitle:string,
        icon:React.ReactNode
}
const data: ContactItemData[] =[
    {
        title:"שעות פתיחה",
        subtitle:"Mon - Sat: 10:00 AM - 7:00PM",
        icon:(
            <Clock className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"/>

        ),
    },
    {
        title:"שלח מייל",
        subtitle:"Shopcart@gmail.com",
        icon:(
            <Mail className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"/>

        ),
    },
     {
        title:"התקשר אלינו",
        subtitle:"050-1234567",
        icon:(
            <Phone className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"/>

        ),
    },
     {
        title:"בקרו אותנו",
        subtitle:"אברבנאל בני ברק",
        icon:(
            <Map className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors"/>

        ),
    }
]
const FooterTop = () => {
    
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 border-b'>
        {data?.map((item)=>(
        
            <div key={item.title} className='flex justify-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect'>
                {item?.icon }
                <div>
                <h3 className='font-semibold text-gray-900 group-hover:text-black hoverEffect'>{item?.title}</h3>
                <p className='text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect' >{item?.subtitle}</p>
                </div>
            </div>

        ))
    }
    </div>
  )
}

export default FooterTop