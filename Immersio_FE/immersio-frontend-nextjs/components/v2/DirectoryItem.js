import { Button } from 'antd'
import Image from 'next/image'
const StartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16.099" height="14.949" viewBox="0 0 16.099 14.949"><defs></defs><path className="a" fill="#3fb0ac" d="M47.489,53.175H42.2L40.6,48.381a.582.582,0,0,0-1.092,0L37.9,53.175H32.575A.577.577,0,0,0,32,53.75a.422.422,0,0,0,.011.1.552.552,0,0,0,.241.406L36.6,57.315l-1.667,4.848a.577.577,0,0,0,.2.647.556.556,0,0,0,.323.14.7.7,0,0,0,.359-.129L40.05,59.8l4.24,3.022a.673.673,0,0,0,.359.129.516.516,0,0,0,.32-.14.57.57,0,0,0,.2-.647L43.5,57.315l4.309-3.091.1-.09a.55.55,0,0,0-.424-.959Z" transform="translate(-32 -48)"/></svg>)

const DirectoryItem = ({item}) => {
  return (
    <div key={item.id} className="directory-item" style={{ padding: '0 40px' }}>
      <div className="d-flex align-items-center directory-item__personal">
        <span className="directory-item__name">{item.name}</span>
        {item.start > 0 && <span className="directory-item__start"><StartIcon /> {item.start}</span>}
      </div>
      <div className="directory-item__address">{item.address}</div>
      <div className="directory-item__image">
        <Image src={item.img} width={318} height={318} />
      </div>
      <div className="directory-item__languages">{item.languages}</div>
      <div className="directory-item__description">{item.description}</div>
    </div>
  )
}

export default DirectoryItem