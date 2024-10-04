import { ArrowRightOutlined, AliwangwangFilled, CalendarOutlined, DownOutlined, DropboxOutlined, FolderFilled, KeyOutlined, MailFilled, MenuOutlined, PieChartFilled, ReadOutlined,
  SignalFilled, StarOutlined, UpOutlined, HeartFilled, WechatFilled, SwitcherFilled, StarFilled, SettingFilled, BookOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const StudentNav = (props) => {
  const router = useRouter()
  const [current, setCurrent] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const courseRef = useRef(null)
  const courseBuildingRef = useRef(null)
  const path = router.pathname

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  return(
    <>
      <div className='navSideContainer-scroll'>
        <nav id='sideBar' className={`navInstructor`}>
          <div className=''>
            <h6 className='col-6'>STUDENT</h6>
          </div>
          <ul>
            <li>
              <Link href={'/student'}>
                <a className={`nav-link ${current === '/student' && 'selected'}`}><SignalFilled className='sideIcon'/><span>Dashboard</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/subscriptions'>
                <a className={`nav-link ${current.includes('categories') && 'selected'}`}><SwitcherFilled className='sideIcon'/><span>Subscription</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/certificates'>
                <a className={`nav-link ${current.includes('certificates') && 'selected'}`}><StarFilled className='sideIcon'/><span>Certificates</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/myCourses'>
                <a className={`nav-link ${current.includes('myCourses') && 'selected'}`}><BookOutlined className='sideIcon'/><span>MyCourses</span></a>
              </Link>
            </li>
            
            <li>
              <Link href='/student/community-chat'>
                <a className={`nav-link ${current.includes('community-chat') && 'selected'}`}><WechatFilled className='sideIcon'/><span>Community chat</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/opie-chat'>
                <a className={`nav-link ${current.includes('opie-chat') && 'selected'}`}><AliwangwangFilled className='sideIcon'/><span>Chat with Opie</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/openspeak-121'>
                <a className={`nav-link ${current.includes('openspeak-121') && 'selected'}`}><CalendarOutlined className='sideIcon'/><span>OpenSpeak 121</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/account'>
                <a className={`nav-link ${current.includes('account') && 'selected'}`}><KeyOutlined className='sideIcon'/><span>Account</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/wishlist'>
                <a className={`nav-link ${current.includes('wishlist') && 'selected'}`}><HeartFilled className='sideIcon'/><span>Wishlist</span></a>
              </Link>
            </li>
            <li>
              <Link href='/student/settings'>
                <a className={`nav-link ${current.includes('payments') && 'selected'}`}><SettingFilled className='sideIcon'/><span>Settings</span></a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default StudentNav