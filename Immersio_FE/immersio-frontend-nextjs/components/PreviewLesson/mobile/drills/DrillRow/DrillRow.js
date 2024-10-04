import React from 'react';
import styles from './DrillRow.module.css';
import { Space, Row } from 'antd';
import { HolderOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

export const DrillRow = (props) => {
    const { content, correct } = props;
    return (
        <> 
            <Row align="middle" className={ 
                    correct === true ? styles.correctBackground + " " + styles.itemStyle
                    : correct === false ? styles.wrongBackground + " " + styles.itemStyle
                    : styles.defaultBackground + " " + styles.itemStyle
                }
            >
                { correct == true ? <CheckOutlined className={styles.correctMark} />
                    : correct == false ? <CloseOutlined className={styles.correctMark}/>
                    : <></>
                }
                <Space className={styles.space}>
                    <p className={styles.paragraphStyle}>{content}</p>                         
                </Space>
                <div className={styles.iconWrapper}>
                    <HolderOutlined className={styles.iconStyle} /> 
                </div>
            </Row>
        </>
    );
}