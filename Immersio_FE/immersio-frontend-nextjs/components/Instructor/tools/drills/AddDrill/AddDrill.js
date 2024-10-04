import DragAndDropPage from "../Page/DragAndDropPage";
import DragTheWordPage from "../Page/DragTheWordPage";
import FillInTheBlankPage from "../Page/FillInTheBlankPage";
import FlashCardPage from "../Page/FlashCardPage";
import MultipleChoicePage from "../Page/MultipleChoicePage";
import { SortParagraphPage } from "../Page/SortParagraphPage";
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext1, DataContext2, DataContext3 } from "../../../../../src/pages/dashboard/course/lesson/lessonInput";
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './AddDrill.module.css';
import { deleteDrill } from "../../../../../src/services/drills/apiDrills";
import { toast } from "react-toastify";
import DragAndDrop, { TooltipDragAndDrop } from "../../DragAndDrop";
import { Modal } from "antd";
import { useTranslation } from "next-i18next";

function AddDrill(props) {
  if (!useContext(DataContext1) && !useContext(DataContext2) && !useContext(DataContext3)) return null;
  let contextArray = [DataContext1, DataContext2, DataContext3];
  const { t } = useTranslation()
  const { drillData, setDrillData } = useContext(contextArray[props.groupNumber]);

  const vocabRef = useRef(props.vocabulary || []);
  const [words, setWords] = useState(props.vocabulary || []);

  useEffect(() => {
    vocabRef.current = props.vocabulary;
    setWords(vocabRef.current);
  }, [props.vocabulary])

  const delDrill = async (id, foundIndex) => {
    let tempDrillData = drillData.slice();
    if (id) {
      try {
        const response = await deleteDrill(id)
        if (response) {
          tempDrillData.splice(foundIndex, 1);
        }
      } catch (error) {
        toast.error(error.data?.message || error.response?.data || 'Something error, please refresh the page');
      }
    } else {
      tempDrillData.splice(foundIndex, 1);
    }

    setDrillData(tempDrillData)
  };

  const reorder = (list, startIndex, endIndex) => {
		const result = JSON.parse(JSON.stringify(list))
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
	
		return result
	}

  const onDragEnd = (result) => {
		if (!result.destination) {
			return
		}

		const items = reorder(drillData, result.source.index, result.destination.index)
		if (JSON.stringify(items) !== JSON.stringify(drillData)) {
			setDrillData(items)
		}
	}

  return (
    <DragAndDrop
      sourceState={drillData}
      onDragEnd={onDragEnd}
    >
      {({ index: i, item: s }) => (
        <div key={"row" + i} className={styles.edit_drill_row + " " + "align-items-center" + " edit_drill_row_item"}>
          {s.drillType === "dragWords" ? <DragTheWordPage drillId={i} groupNumber={props.groupNumber} />
            : s.drillType === "multipleChoice" ? <MultipleChoicePage drillId={i} groupNumber={props.groupNumber} />
              : s.drillType === "flashcards" ? <FlashCardPage drillId={i} groupNumber={props.groupNumber} />
                : s.drillType === "dragNdrop" ? (
                  <DragAndDropPage
                    drillId={i}
                    words={
                      (drillData?.[i]?.answers || []).filter(item => item).length
                        ? drillData?.[i]?.answers
                        : words
                    }
                    setWords={setWords}
                    groupNumber={props.groupNumber}
                  />
                )
                  : s.drillType === "fillBlank" ? <FillInTheBlankPage drillId={i} groupNumber={props.groupNumber} />
                    : s.drillType === 'sort' ? <SortParagraphPage drillId={i} groupNumber={props.groupNumber} />
                      : null}

          <DeleteOutlined
            className={styles.icon}
            onClick={() => {
              Modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: t('dashboard.modal.please_ensure_data'),
                onOKText: t('dashboard.button.save'),
                onCancelText: t('dashboard.button.cancel'),
                onOk() {
                  delDrill(s.id, i)
                },
              })
            }}
          />
          <div className="ml-5">
            <TooltipDragAndDrop title="" />
          </div>
        </div>
      )}
    </DragAndDrop>
  );
}

export default AddDrill;