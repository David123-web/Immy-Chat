import { IDrillData } from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Input, Switch } from 'antd';

const { Panel } = Collapse;
interface ISortTheParagraphDrill {
	drillData: IDrillData[];
	onCancel: (cancel: boolean) => void;
	onSave: (drilData: IDrillData[]) => void;
}

const SortTheParagraphDrill = (props: ISortTheParagraphDrill) => {
	const { drillData, onCancel, onSave } = props;
	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		const newDrillData = values.questions.map((card, index) => {
			return {
				id: index + 1,
				order: index,
				question: card.question,
				content: card.sentences.map(x => x.sentence),
				correctIndex: 0,
			};
		});
		console.log(newDrillData)
		onSave(newDrillData);
	};
	return (
		<>
			<Form form={form} name="sort-the-paragraph-form" onFinish={onFinish} autoComplete="off">
				<Form.List
					name="questions"
					initialValue={drillData.map((question) => {
						return {
							question: question.question,
							sentences: question.content.map(x => {
								return {
									sentence: x
								};
							}),
						};
					})}
				>
					{(questions, { add, remove }) => (
						<>
							<Collapse accordion>
								{questions.map((question) => (
									<Panel
										key={question.key}
										header={
											<div className="tw-flex tw-justify-between">
												<span>Paragraph</span>
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
										<Form.Item>
											<Form.List name={[question.name, 'sentences']}>
												{(sentences, { add, remove }) => (
													<>
														{sentences.map((setence) => (
															<div key={setence.key}>
																<Form.Item {...setence} name={[setence.name, 'sentence']} className="tw-mb-2">
																	<Input
																		className="tw-w-full tw-border-solid border-theme-6 tw-border-2 tw-px-4 tw-py-2"
																		placeholder={`Enter a sentence of the paragraph in the correct order`}
																		suffix={
																			<DeleteOutlined
																				onClick={() => {
																					remove(setence.name);
																				}}
																			/>
																		}
																	/>
																</Form.Item>
															</div>
														))}

														<Form.Item className="!tw-m-0">
															<Button
																className="tw-w-full tw-rounded-md tw-font-semibold tw-text-lg tw-flex tw-items-center tw-py-6"
																onClick={() => add()}
																icon={
																	<PlusOutlined className="bg-theme-4 color-theme-7 tw-text-xs tw-p-1 tw-rounded-2xl" />
																}
															>
																New alternative sentence
															</Button>
														</Form.Item>
													</>
												)}
											</Form.List>
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
									Add a new question?
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>

			<div className="tw-flex tw-justify-between">
				<Button
					htmlType="submit"
					form="sort-the-paragraph-form"
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

export default SortTheParagraphDrill;
