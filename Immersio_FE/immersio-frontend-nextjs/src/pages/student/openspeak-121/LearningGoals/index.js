import { Form, Steps, Button, Radio, Space, Modal, Input, Select, Typography } from 'antd';
import styles from '../../../../../components/Student/forms/opie121/learningGoals.module.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, createContext, useRef } from 'react';
import { useRouter } from 'next/router'

export const LearningGoalContext =  createContext()
const { Step } = Steps
const { Option } = Select

const LearningGoals = () => {
    const router = useRouter()
    const [stageNumber, setStageNumber] = useState(0);
    const stageTwoOptionRef = useRef('');
    const { Paragraph, Text } = Typography;
    const [stageTwoOption, setStageTwoOption] = useState(-1);
    const [stageThreeOption, setSTageThreeOption] = useState(-1);
    const timePeriodRef = useRef([]);
    const dayOfWeekRef = useRef([]);
    const [learningGoalData, setLearningGoalData] = useState({})
    const titles = ['Why do you wish to learn Latin language?',
        'My current level of Latin is...',
        'Which level of proficiency do you want to achieve?',
        'What languages do you speak?',
        'Let\'s schedule your day and time'];
    const subTitles = ['Select your most relevant answer',
        'Select a level of your proficiency',
        'Your current level of Latin proficiency is ' + stageTwoOptionRef.current,
        'List all languages that you can speak other than Latin',
        'Select your best suitable schedule'];
    const levelTitle = ["A1 - Beginner", "A2 - Elementary", "B1 - Intermediate", "B2 - Upper intermediate", "C1 - Advanced", "C2 - Proficient"]
    const levelDescriptions = [
        ("Level A1 corresponds to basic users of the language, i.e. those able to communicate"
            + "  in everyday situations with commonly-used expressions and elementary vocabulary"),
        ("Level A2 corresponds to basic users of the language, i.e. those able to communciate"
            + " in everyday situations with commonly-used expressions and elementary vocabulary."),
        ("Level B1 corresponds to independent users of the language, i.e. those who have the necessary "
            + "fluency to communicate without effort with native speakers."),
        ("Level B2 corresponds to independent users of the language, i.e. those who have the necessary "
            + "fluency to communicate without effort with native speakers."),
        ("Level C1 corresponds to proficient users of the language, i.e. those able to perform "
            + "complex tasks related to work and study."),
        ("Level C2 corresponds to proficient users of the language, i.e. those able to perform "
            + "complex tasks related to work and study.")]
    const levelArray = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const timeArray = ['6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am', '12-3am', '3am-6am'];
    const dayOfWeekArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const nextStage = () => {
        setStageNumber(stageNumber + 1);
    }
    const editStageTwo = () => {
        setStageNumber(1);
        setSTageThreeOption(-1);
    }
    const onChangeStageTwo = (e) => {
        setStageTwoOption(levelArray.indexOf(e.target.value));
        stageTwoOptionRef.current = e.target.value;
    }
    const onChangeStageThree = (e) => {
        setSTageThreeOption(levelArray.indexOf(e.target.value));
    }
    const toggleTimePeriodOption = (ele) => {
        console.log(ele)
        let temp = timePeriodRef.current.slice();
        console.log("temp", temp);
        const index = temp.indexOf(ele);
        if (index === -1) {
            temp.push(ele);
            document.querySelector("#time_period_" + ele).style.backgroundColor = '#CCF7FF';
        } else {
            temp = temp.filter(element => element !== ele);
            document.querySelector("#time_period_" + ele).style.backgroundColor = '#FFFFFF';
        }
        timePeriodRef.current = temp;
        console.log("final", timePeriodRef.current)
    }

    const toggleDayOfWeekOption = (ele) => {
        console.log(ele)
        let temp = dayOfWeekRef.current.slice();
        console.log("temp", temp);
        const index = temp.indexOf(ele);
        if (index === -1) {
            temp.push(ele);
            document.querySelector("#day_of_week_" + ele).style.backgroundColor = '#CCF7FF';
        } else {
            temp = temp.filter(element => element !== ele);
            document.querySelector("#day_of_week_" + ele).style.backgroundColor = '#FFFFFF';
        }
        dayOfWeekRef.current = temp;
        console.log("final", dayOfWeekRef.current)
    }

    const submitForm1 = (e) => {
        console.log(e)
        if (!e.stageOne) {
            Modal.error({ title: "Select an answer" })
        } else {
            setLearningGoalData({ ...learningGoalData, stageOne: e.stageOne.target.value })
            nextStage();
        }
    }
    const submitForm2 = (e) => {
        console.log(e)
        if (!e.stageTwo) {
            Modal.error({ title: "Select an answer" })
        } else {
            setLearningGoalData({ ...learningGoalData, stageTwo: e.stageTwo.target.value })
            nextStage();
        }
    }
    const submitForm3 = (e) => {
        console.log(e)
        if (!e.stageThree) {
            Modal.error({ title: "Select an answer" })
        } else {
            setLearningGoalData({ ...learningGoalData, stageThree: e.stageThree.target.value })
            nextStage();
        }
    }
    const submitForm4 = (e) => {
        console.log(e)
        if (!e.stageFour) {
            Modal.error({ title: "Select an answer" })
        } else {
            setLearningGoalData({ ...learningGoalData, stageFour: e.stageFour })
            nextStage();
        }
    }
    const submitForm5 = (e) => {
        console.log(e)
        if (dayOfWeekRef.current.length === 0 || timePeriodRef.current.length === 0) {
            Modal.error({ title: "Select some study time(s)" })
        } else {
            const stageFiveData = {
                hours: e.hours,
                timePeriods: timePeriodRef.current,
                daysOfWeek: dayOfWeekRef.current,
            }
            setLearningGoalData({ ...learningGoalData, stageFive: stageFiveData })
            dataRef.current = { ...learningGoalData, stageFive: stageFiveData };
            Modal.success({
                content: <>        <div>
                    <div>
                        Reason: {dataRef.current.stageOne}
                    </div>
                    <div>
                        Current level: {dataRef.current.stageTwo}
                    </div>
                    <div>
                        Goal level: {dataRef.current.stageThree}
                    </div>
                    <div>
                        Languages:
                        {
                            dataRef.current.stageFour.map((ele) => {
                                return (
                                    <div><span>{ele.language} </span><span>{ele.proficiency}</span></div>
                                )
                            })
                        }
                    </div>
                    <div>
                        Time:
                        <div>
                            Hour: {dataRef.current.stageFive.hours}
                        </div>
                        <div>
                            Time Periods:
                            {
                                dataRef.current.stageFive.timePeriods.map((ele) => {
                                    return (
                                        <span> {ele}</span>
                                    )
                                })
                            }
                        </div>
                        <div>
                            Days:
                            {
                                dataRef.current.stageFive.daysOfWeek.map((ele) => {
                                    return (
                                        <span> {ele}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div></>
            })
        }
    }

    const flashCardModalTextStyling = {
        fontWeight: '650',
        fontSize: '16px',
    }

    const stageOne = (
        <Form onFinish={submitForm1}>
            <Form.Item name="stageOne" valuePropName='radio'>
                <Radio.Group className='w-100 custom-choose '>
                    <Space direction="vertical" className="custom-choose-space w-100">
                        <Radio value={'hobbies'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>{"Hobbies " + "\u0026" + " Interest"}</span>
                            </div>
                        </Radio>
                        <Radio value={'career'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>Career Development</span>
                            </div>
                        </Radio>
                        <Radio value={'study'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>Study (secondary or post-secondary)</span>
                            </div>
                        </Radio>
                        <Radio value={'religious'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>Religious Study</span>
                            </div>
                        </Radio>
                        <Radio value={'travel'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>Travelling</span>
                            </div>
                        </Radio>
                        <Radio value={'relocation'}>
                            <div className="d-flex align-items-center">
                                <span style={flashCardModalTextStyling}>Relocation</span>
                            </div>
                        </Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>
            <Form.Item><Button type="Primary" className='learning-goal-steps-button' htmlType='submit'>Continue</Button></Form.Item>
        </Form>
    )

    const stageTwo = (
        <Form onFinish={submitForm2}>
            <div className={styles.languageLevelParent}>
                <Form.Item name="stageTwo" valuePropName='radio'>
                    <Radio.Group className='w-100 custom-choose ' onChange={onChangeStageTwo} defaultValue={stageTwoOptionRef.current || ''}>
                        <Space direction="vertical" className="custom-choose-space w-100">
                            <Radio value={'A1'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>A1 - Beginner</span>
                                </div>
                            </Radio>
                            <Radio value={'A2'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>A2 - Elementary</span>
                                </div>
                            </Radio>
                            <Radio value={'B1'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>B1 - Intermediate</span>
                                </div>
                            </Radio>
                            <Radio value={'B2'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>B2 - Upper intermediate</span>
                                </div>
                            </Radio>
                            <Radio value={'C1'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>C1 - Advanced</span>
                                </div>
                            </Radio>
                            <Radio value={'C2'}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>C2 - Proficient</span>
                                </div>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                { stageTwoOption !== -1 &&
                    <div className='learning-goal-textContainer'>
                        <h4 className='learning-goal-level-title mt-4'>{stageTwoOption !== -1 ? levelTitle[stageTwoOption] : null}</h4>
                        <br />
                        <span className='learning-goal-level-subtitle'>{stageTwoOption !== -1 ? levelDescriptions[stageTwoOption] : null}</span>
                    </div>
                }

            </div>
            <Form.Item><Button type="Primary" className='learning-goal-steps-button' htmlType='submit'>Continue</Button></Form.Item>
        </Form>
    )

    const stageThree = (
        <Form onFinish={submitForm3}>
            <div className={styles.languageLevelParent}>
                <Form.Item name="stageThree" valuePropName='radio'>
                    <Radio.Group className='w-100 custom-choose ' onChange={onChangeStageThree}>
                        <Space direction="vertical" className="custom-choose-space w-100">
                            <Radio value={'A1'} disabled={'A1' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>A1 - Beginner</span>
                                </div>
                            </Radio>
                            <Radio value={'A2'} disabled={'A2' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>A2 - Elementary</span>
                                </div>
                            </Radio>
                            <Radio value={'B1'} disabled={'B1' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>B1 - Intermediate</span>
                                </div>
                            </Radio>
                            <Radio value={'B2'} disabled={'B2' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>B2 - Upper intermediate</span>
                                </div>
                            </Radio>
                            <Radio value={'C1'} disabled={'C1' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>C1 - Advanced</span>
                                </div>
                            </Radio>
                            <Radio value={'C2'} disabled={'C2' === stageTwoOptionRef.current}>
                                <div className="d-flex align-items-center">
                                    <span style={flashCardModalTextStyling}>C2 - Proficient</span>
                                </div>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                { stageTwoOption !== -1 &&
                    <div className='learning-goal-textContainer'>
                        <h4 className='learning-goal-level-title mt-4'>{stageTwoOption !== -1 ? levelTitle[stageTwoOption] : null}</h4>
                        <br />
                        <span className='learning-goal-level-subtitle'>{stageTwoOption !== -1 ? levelDescriptions[stageTwoOption] : null}</span>
                    </div>
                }
            </div>
            <Form.Item><Button type="Primary" className='learning-goal-steps-button' htmlType='submit'>Continue</Button></Form.Item>
        </Form>
    )
    const stageFour = (
        <Form onFinish={submitForm4}>
            <Form.List name="stageFour">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'language']}
                                    rules={[{ required: true, message: 'Type in a language' }]}
                                >
                                    <Input placeholder="Type in a language" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'proficiency']}
                                    rules={[{ required: true, message: 'Select a proficiency level' }]}
                                >
                                    {/* <Input placeholder="Proficiency level" /> */}
                                    <Select style={{ width: 200 }}>
                                        <Option value="Native">Native</Option>
                                        <Option value="Beginner">Beginner</Option>
                                        <Option value="Intermediate">Intermediate</Option>
                                    </Select>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item><Button type="Primary" htmlType='submit' className='learning-goal-steps-button'>Continue</Button></Form.Item>
        </Form>
    )
    const stageFive = (
        <Form onFinish={submitForm5}>
            <Text strong>How many hours per week can you study?</Text>
            <Form.Item name={"hours"} rules={[{ required: true, message: 'Enter a number' }]}>
                <Input type={"number"} />
            </Form.Item>
            <Text strong>What is the best time for you to study?</Text>
            <div className={styles.time_period_div}>
                {timeArray.map(ele => <div id={"time_period_" + ele} className={styles.time_period} onClick={() => { toggleTimePeriodOption(ele) }}>{ele}</div>)}
            </div>
            <Text strong>What days of the week are best for you to study?</Text>
            <div className={styles.day_of_week_div}>
                {dayOfWeekArray.map(ele => <div id={"day_of_week_" + ele} className={styles.day_of_week} onClick={() => { toggleDayOfWeekOption(ele) }}>{ele}</div>)}
            </div>
            <Form.Item><Button htmlType="submit" type="Primary" className='learning-goal-steps-button' onClick={()=>router.push('/student/openspeak-121')}>Review your learning path</Button></Form.Item>
        </Form>
    )

    const steps = [
        {
            content: stageOne,
        },
        {
            content: stageTwo,
        },
        {
            content: stageThree,
        },
        {
            content: stageFour,
        },
        {
            content: stageFive,
        }
    ];

    return(
        <>
            <h2 className='title-121 mt-4'>{titles[stageNumber]}</h2>
            <h4 className='subtitle-121 mb-4'>{subTitles[stageNumber]}</h4>

            <div className='learning-goal-steps-container'>
                {stageNumber === 2 ? <Button onClick={editStageTwo}>Edit</Button> : null}
                <Steps className='learning-goal-steps opie121-center-div' current={stageNumber}>
                    {steps.map((item, index) => (
                        <Step key={item.index} />
                    ))}
                </Steps>
                <br />
            </div>

            <div className='opie121-learningpath-card-body'>
                <div className="steps-content">{steps[stageNumber].content}</div>
            </div>
        </>
    )
}

export default LearningGoals