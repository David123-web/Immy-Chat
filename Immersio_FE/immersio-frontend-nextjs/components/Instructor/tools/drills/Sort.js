import { SoundFilled, DownOutlined, UpOutlined } from '@ant-design/icons'
import { Image, List, Avatar } from 'antd';
import { useState } from 'react'
import React from 'react'

const { Item } = List;

const Sort = (props) => {
	const [ backG, setBackG] = useState('#956424')

	const checkPosition = () => {
		props.inputList[props.index].txt.forEach((item, idx) => {
			if(item.pos == idx) {
				item.backG = '#D5FFD5'
			} else {
				item.backG = '#FFC9C9'
			}
		})
	}

	checkPosition()

	return(
		<>
		{
			props.answered ? (
					<List onDragOver={e => preventDefault()} itemLayout='horizontal' dataSource={props.inputList[props.index].txt} style={{width:'60%'}} renderItem={(item, idx) => (
						<Item  style={{background:item.backG,marginBottom:10,borderRadius:10,boxShadow:"1px 3px 1px #9E9E9E"}}>
							<Item.Meta avatar={ <span style={{marginLeft:10}}>{item.content}</span> } />
								<>
									<Avatar style={{background:'transparent',marginRight:7,display:'inline-block',verticalAlign:'middle'}}/>
									<Avatar style={{background:'transparent',marginRight:20}}/>
								</>							
							</Item>
						)}>
					</List>
				) : (
					<List onDragOver={e => preventDefault()} itemLayout='horizontal' dataSource={props.inputList[props.index].txt} style={{width:'60%'}} renderItem={(item, idx) => (
						<Item  style={{background:'#ddd',marginBottom:10,borderRadius:10,boxShadow:"1px 3px 1px #9E9E9E"}}>
							<Item.Meta avatar={ <span style={{marginLeft:10}}>{item.content}</span> } />
							{ idx == 0 ? (
									<>
									<Avatar onClick={(e) => props.changePosition(item,idx,'down')} style={{background:'#fff',marginRight:7,display:'inline-block',verticalAlign:'middle',cursor:'pointer'}}>
										<DownOutlined className='fw-bolder' style={{fontSize:22,color:'#25A5AA'}}/>
									</Avatar>
									<Avatar style={{marginRight:20}}>
										<UpOutlined className='fw-bolder' style={{fontSize:22,color:'#727272',fontWeigth:'bold'}}/>
									</Avatar>
									</>
								) : idx == props.inputList[props.index].txt.length-1 ? (
									<>
									<Avatar style={{marginRight:7,display:'inline-block',verticalAlign:'middle'}}>
										<DownOutlined className='fw-bolder' style={{fontSize:22,color:'#727272'}}/>
									</Avatar>
									<Avatar onClick={(e) => props.changePosition(item,idx,'up')} style={{background:'#fff',marginRight:20,cursor:'pointer'}}>
										<UpOutlined className='fw-bolder' style={{fontSize:22,color:'#25A5AA',fontWeigth:'bold'}}/>
									</Avatar>
									</>
								) : (
									<>
									<Avatar onClick={(e) => props.changePosition(item,idx,'down')} style={{background:'#fff',cursor:'pointer',marginRight:7,display:'inline-block',verticalAlign:'middle'}}>
										<DownOutlined className='fw-bolder' style={{fontSize:22,color:'#25A5AA'}}/>
									</Avatar>
									<Avatar onClick={(e) => props.changePosition(item,idx,'up')} style={{background:'#fff',marginRight:20,cursor:'pointer'}}>
										<UpOutlined className='fw-bolder' style={{fontSize:22,color:'#25A5AA',fontWeigth:'bold'}}/>
									</Avatar>
									</>
								)}
							</Item>
						)}>
					</List>
			)
		}
		</>
	)
}

export default Sort