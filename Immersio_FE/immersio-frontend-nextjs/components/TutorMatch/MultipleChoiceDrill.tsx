import { IDrillData } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Input, Switch } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';

const { Panel } = Collapse;
interface IMultipleChoiceDrill {
	drillData: IDrillData[];
	onCancel: (cancel: boolean) => void;
	onSave: (drilData: IDrillData[]) => void;
}

const MultipleChoiceDrill = (props: IMultipleChoiceDrill) => {
	const { drillData, onCancel, onSave } = props;
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		if (values.questions.some((x) => x.correctIndex === undefined)) {
			toast.error('Please select a correct answer');
		} else {
			const newDrillData = values.questions.map((card, index) => {
				return {
					id: index + 1,
					order: index,
					question: card.question,
					content: card.answers.map((x) => x.answer),
					correctIndex: card.correctIndex,
				};
			});
			onSave(newDrillData);
		}
	};

	return (
		<>
			<Form
				form={form}
				name="multiple-choice-form"
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					questions: drillData.map((question) => {
						return {
							question: question.question,
							answers: question.content.map((x, i) => {
								return {
									answer: x,
									isCorrect: i === question.correctIndex,
								};
							}),
							correctIndex: question.correctIndex,
						};
					}),
				}}
			>
				<Form.List name="questions">
					{(questions, { add, remove }) => (
						<>
							<Collapse accordion>
								{questions.map((question) => (
									<Panel
										key={question.key}
										header={
											<div className="tw-flex tw-justify-between">
												<span>Question {question.name + 1}</span>
												<DeleteOutlined
													onClick={() => {
														remove(question.name);
													}}
												/>
											</div>
										}
									>
										<Form.Item {...question} name={[question.name, 'question']} className="tw-mb-2">
											<Input
												className="tw-w-full tw-border-dashed border-theme-6 tw-border-2 tw-px-4 tw-py-2"
												placeholder={`Enter a text question`}
											/>
										</Form.Item>
										<Form.List name={[question.name, 'answers']}>
											{(answers, { add, remove }) => (
												<>
													{answers.map((answer) => (
														<Input.Group key={answer.key} {...answer} compact>
															<Form.Item name={[answer.name, 'answer']} className="tw-w-full">
																<Input
																	className="tw-w-full tw-border-solid border-theme-6 tw-border-2 tw-px-4 tw-py-2"
																	placeholder={`Enter the No.${answer.name + 1} alternative answer`}
																	suffix={
																		<div className="tw-flex tw-gap-4 tw-items-center">
																			<div className="tw-flex tw-gap-2 tw-items-center">
																				<span>Correct</span>
																				<Form.Item
																					className="!tw-mb-0"
																					name={[answer.name, 'isCorrect']}
																					valuePropName="checked"
																				>
																					<Switch
																						className="tw-ml-2"
																						onChange={(checked: boolean) => {
																							if (checked) {
																								const currentCorrectIndex = form.getFieldValue([
																									'questions',
																									question.name,
																									'correctIndex',
																								]);
																								form.setFieldValue(
																									[
																										'questions',
																										question.name,
																										'answers',
																										currentCorrectIndex,
																										'isCorrect',
																									],
																									false
																								);
																								form.setFieldValue(
																									['questions', question.name, 'correctIndex'],
																									answer.name
																								);
																							}
																						}}
																					/>
																				</Form.Item>
																			</div>
																			<DeleteOutlined
																				onClick={() => {
																					remove(answer.name);
																				}}
																			/>
																		</div>
																	}
																/>
															</Form.Item>
														</Input.Group>
													))}

													<Form.Item className="!tw-m-0">
														<Button
															className="tw-w-full tw-rounded-md tw-font-semibold tw-text-lg tw-flex tw-items-center tw-py-6"
															onClick={() => add()}
															icon={
																<PlusOutlined className="bg-theme-4 color-theme-7 tw-text-xs tw-p-1 tw-rounded-2xl" />
															}
														>
															New alternative answer
														</Button>
													</Form.Item>
												</>
											)}
										</Form.List>
										<Form.Item {...question} name={[question.name, 'correctIndex']} className="tw-hidden">
											<Input />
										</Form.Item>
									</Panel>
								))}
							</Collapse>

							<Form.Item>
								<Button
									className="tw-w-full tw-rounded-md tw-font-semibold tw-text-lg tw-flex tw-items-center tw-py-6"
									onClick={() => add()}
									icon={<PlusOutlined className="bg-theme-4 color-theme-7 tw-text-xs tw-p-1 tw-rounded-2xl" />}
								>
									New question
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>

			<div className="tw-flex tw-justify-between">
				<Button
					htmlType="submit"
					form="multiple-choice-form"
					className="bg-theme-4 color-theme-7 !tw-border-none tw-rounded-md"
				>
					Save changes
				</Button>
				<Button
					onClick={() => {
						onCancel(false);
					}}
					className="bg-theme-6 color-theme-7 !tw-border-none tw-rounded-md"
				>
					Cancel
				</Button>
			</div>
		</>
	);
};

export default MultipleChoiceDrill;
