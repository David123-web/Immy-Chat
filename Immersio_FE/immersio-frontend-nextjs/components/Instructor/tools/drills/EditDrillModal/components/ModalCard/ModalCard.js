import React, { useEffect, useState, useRef } from 'react';
import { Card, Collapse } from 'antd';
import { DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { AddRow } from '../AddRow/AddRow';
import styles from './ModalCard.module.css';

export const ModalCard = (props) => {
    const { title, deleteBtnHandler, index } = props;
    const { Panel } = Collapse;
    const { showCloud, setShowCloud } = useState(false);
    const [cardContent, setCardContent] = useState([]);
    const cardContentRef = useRef(cardContent);

    let templateRow;

    useEffect(() => {
        if (props.ShowCloud) setShowCloud(props.ShowCloud);
        if (props.cardContent.length == 0) return;

        const idContent = props.cardContent.map((card, rowIndex) => {
            return React.cloneElement(
                card,
                {
                    id: index + "-" + rowIndex,
                    key: 'row' + index + '-' + rowIndex,
                }
            )
        });

        const initialContent = [...idContent];
        const nextCount = initialContent.length;
        initialContent.push(
            <AddRow text="New Alternative answer" addRowHandler={addRowHandler} key={"row" + nextCount} />
        );
  
        initialContent.length === 1 ? templateRow = initialContent[0] : templateRow = initialContent[1];
        setCardContent(initialContent.slice());
    },[]);

    useEffect(() => {
        cardContentRef.current = cardContent;
    }, [cardContent]);

    //Add a textrow from template (first child)
    const addRowHandler = () => {
        const tempArr = [...cardContentRef.current];
        const nextKey = tempArr.length;
        const clonedRow = React.cloneElement(templateRow, { 
            key: 'row' + index + '-' + nextKey,
            id: index + '-' + nextKey,
            value: '',
        });

        tempArr[tempArr.length] = tempArr[tempArr.length - 1];
        tempArr[tempArr.length - 2] = (clonedRow);
        setCardContent(tempArr.slice());
    }

    const deleteBtnClick = (e) => {
        deleteBtnHandler(index, e);
    }

    const titleWrapper = (
        <>
            <div className={styles.titleWrapper}>
                <h4 className={styles.cardTitle}>{title}</h4>
            </div>

            <div className={styles.iconWrapper}>
            {showCloud && <CloudUploadOutlined className={styles.icon}  />}
            <DeleteOutlined className={styles.icon} onClick={deleteBtnClick} />
            </div>
        </>
    );


    return (
        <div className="site-card-border-less-wrapper">
            <Collapse>
                <Panel header={titleWrapper}>
                    <Card bordered={false} >
                        {cardContent.map((item, index) => <div key={"modalcardwrapper"+index}>{item}</div> )}
                    </Card>
                </Panel>
            </Collapse>
        </div>
    );
}
