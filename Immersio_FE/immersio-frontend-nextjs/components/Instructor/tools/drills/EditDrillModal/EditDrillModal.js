import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Input } from 'antd';
import { AddRow } from './components/AddRow/AddRow';
import styles from './EditDrillModal.module.css';

//Currently only used for paragraphsort. Is mostly extensible though, can be used for other components if wanted
export const EditDrillModal = (props) => {
    const { addRowText, saveData, onCardDeleteHandler, cards  } = props;
    const defaultHeaderText = "Sort the paragraphs in the correct order";

    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('Enter an instruction for this drill');
    const [cardList, setCardList] = useState([]);
    const [counter, setCounter] = useState(props.children.length || 1);
    
    const cardListRef = useRef(cardList);
    const counterRef = useRef(counter);

    const showModal = () => {
        setIsVisible(true);
    }

    const handleSave = () => {
        setIsVisible(false);
        saveData(title);        
    }

    const handleCancel = () => {
        setIsVisible(false);
    }

    useEffect(() => {
        setTitle(props.title);
        let keyedCards;

        if (props.children.length) {
            keyedCards = props.children.map((card, index) => (
                <div key={"keyed card wrapper"+index}>
                    {React.cloneElement(card, { 
                        key: "modalCard" + props.children.indexOf(card),
                        deleteBtnHandler: deleteBtnHandler,
                    })}
                </div>
            ));
        } else {
            keyedCards = [
                <>
                    {React.cloneElement(props.children, { 
                        key: "modalCard" + 0,
                        deleteBtnHandler: deleteBtnHandler,
                    })}
                </>
            ];
        }
        setCardList([...keyedCards]);
        cardListRef.current = cardList;
    }, []);

    useEffect(() => {
        cardListRef.current = cardList;
    }, [cardList]);

    useEffect(() => {
        counterRef.current = counter;
    }, [counter]);

    useEffect(() => {
        if (cards.length !== 0) {

            const keyedCards = cards.map((card, index) => (
                <div key={"differentKeyedCardWrapper"+index}>
                    {React.cloneElement(card, { 
                        deleteBtnHandler: deleteBtnHandler,
                    })}
                </div>
            ));
            setCardList(keyedCards.slice());
        }
        
    }, [cards]);

    const deleteBtnHandler = (index, e) => {
        const tempCards = [...cardListRef.current];
        let cardIndex;

        tempCards.forEach(card => {
            if (card.props.children.props.index === index) {
                cardIndex = tempCards.indexOf(card);
            }
        });

        if (cardIndex !== undefined) {
            tempCards.splice(cardIndex, 1);
            setCardList(tempCards.slice());
        }

        onCardDeleteHandler(index);

        
    }

    const addRowHandler = () => {
        let count = counter;
        count++;
        setCounter(count);
        let newCard;
        const newIndex = cardListRef.current.length;

        if (props.children[0]) {
            newCard = 
            //Use <> to keep fragment structure consistent as keyedCards in initial mount
            <>
                {React.cloneElement(props.children[0], { 
                    key: "modalCard" + newIndex,
                    index: newIndex,
                    deleteBtnHandler: deleteBtnHandler,
                })}
            </>
        } else {
            newCard = 
            <>
                {React.cloneElement(
                    props.children, 
                    { 
                        key: "modalCard " + newIndex,
                        index: newIndex,
                        deleteBtnHandler: deleteBtnHandler,
                    }
                )}
            </>;
        }
        
        const tempCards = [...cardListRef.current];
        tempCards.push(newCard);
        setCardList(tempCards.slice());
    }

    const renderChildCards = cardList && cardList.map((card, index) => {
        return(
        <div key={"renderCardWrapper"+index}>
            {React.cloneElement(card, { deleteBtnHandler: deleteBtnHandler, })}
        </div>
        )
    });

    const headerWrapper = (
        <div className={styles.headerWrapper}>
            <Input 
                placeholder={title} 
                bordered={false}
                style={{ border: '2px dotted gray', color: "black" }}
                onChange={setTitle}
                disabled={true}
                value={defaultHeaderText}
            />
        </div>
    );

    const footerWrapper = (
        <div className={styles.footerWrapper}>
            <Button 
                shape="round" 
                type="primary" 
                onClick={handleSave}
                style={{ background:'#27AA9B' }}
            >
                Save changes
            </Button>
            <Button 
                shape="round" 
                type="ghost" 
                loading={loading} 
                onClick={handleCancel}
                style={{ 
                    background: '#9F9F9F', 
                    color: 'white', 
                    borderColor: '#9F9F9F' 
                }}
            >
                Cancel
            </Button>
        </div>
    );

    return(
        <>
            <Button key="editdrillbutton" type="primary" onClick={showModal} className={styles.editButton + " " + "drillEdit"}>
                Edit Drill
            </Button>
            <Modal
                key="editdrillmodal"
                visible={isVisible}
                title={headerWrapper}
                closable={false}
                destroyOnClose={true}
                onCancel={handleCancel}
                footer={[footerWrapper]}  
                bodyStyle={{
                    backgroundColor: '#EDEDED'
                }}
                className="drillModal"
            >
                {renderChildCards}
                
                <div key="wrapper" className={styles.addRowWrapper}>
                    <AddRow key="addrow" addRowHandler={addRowHandler} text={addRowText} />
                </div>
            </Modal>
        </>
    );
}
