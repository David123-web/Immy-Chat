import { CloudFilled, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Collapse, Button, Input } from 'antd';
import form from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import React, { useRef, useState } from 'react';
import AddMediaModal from './AddMediaModal';
import { IDrillData } from '@/src/interfaces/tutorMatch/tutorMatch.interface';

const { Panel } = Collapse;
interface IListenAndFillInTheBlanksDrill {
	drillData: IDrillData[];
	onCancel: (cancel: boolean) => void;
	onSave: (drilData: IDrillData[]) => void;
}

const ListenAndFillInTheBlanksDrill = (props: IListenAndFillInTheBlanksDrill) => {
	const { onCancel, drillData, onSave } = props;
	const [form] = Form.useForm();
	const [isOpenAddMediaModal, setIsOpenAddMediaModal] = useState<boolean>(false);
	const [mediaUrl, setMediaUrl] = useState<string>();
	const selectedQuestionPath = useRef<string[]>([]);

	const onFinish = (values: any) => {
		const newDrillData = values.questions.map((card, index) => {
			return {
				id: index + 1,
				order: index,
				question: card.question,
				content: [card.answer],
				media: card.media,
				mediaUrl: card.mediaUrl,
				correctIndex: 0,
			};
		});
		onSave(newDrillData);
	};
	return (
		<>
			<Form form={form} name="listen-and-fill-in-the-blanks-form" onFinish={onFinish} autoComplete="off">
				<Form.List
					name="questions"
					initialValue={drillData.map((question) => {
						return {
							question: question.question,
							answer: question.content[0],
							media: question.media,
							mediaUrl: question.mediaUrl,
						};
					})}
				>
					{(fields, { add, remove }) => (
						<>
							<Collapse accordion>
								{fields.map((field) => (
									<Panel
										key={field.key}
										header={
											<div className="tw-flex tw-justify-between">
												<span>Task {field.name + 1}</span>
												<DeleteOutlined
													onClick={() => {
														console.log(field);
														remove(field.name);
													}}
												/>
											</div>
										}
									>
										<Form.Item name={[field.name, 'media']} className="tw-hidden" />
										<Form.Item name={[field.name, 'mediaUrl']} className="tw-hidden" />
										<Form.Item {...field} name={[field.name, 'question']} className="tw-mb-2">
											<Input
												className="tw-w-full tw-border-solid border-theme-6 tw-border-2 tw-px-4 tw-py-2"
												placeholder={`Enter a text requirement for the No.${field.name + 1} task`}
												suffix={[
													form.getFieldValue(['questions', field.name.toString()]) && (
														<CloudFilled
															id={field.name.toString()}
															onClick={(e) => {
																selectedQuestionPath.current = ['questions', e.currentTarget.id];
																setMediaUrl(form.getFieldValue(['questions', field.name.toString(), 'mediaUrl']));
																setIsOpenAddMediaModal(true);
															}}
															className="bg-theme-7 color-theme-4 tw-text-2xl"
														/>
													),
													<Button
														id={field.name.toString()}
														className="tw-border-none no- tw-w-full tw-text-base tw-flex tw-items-center"
														onClick={(e) => {
															selectedQuestionPath.current = ['questions', e.currentTarget.id];
															setMediaUrl(form.getFieldValue(['questions', field.name.toString(), 'mediaUrl']));
															setIsOpenAddMediaModal(true);
														}}
														icon={
															<PlusOutlined className="bg-theme-4 color-theme-7 tw-text-xs tw-p-1 tw-rounded-2xl" />
														}
													>
														Add media
													</Button>,
												]}
											/>
										</Form.Item>
										<Form.Item {...field} name={[field.name, 'answer']} className="tw-mb-2">
											<TextArea
												style={{ resize: 'none' }}
												className="tw-w-full tw-border-dashed border-theme-6 tw-border-2 tw-px-4 tw-py-2"
												placeholder={
													'Enter a text block, in which the missing words are added with an asterisk (*) in front and behind the intended hidden word/phrase.'
												}
											/>
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
									New task
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>

			<div className="tw-flex tw-justify-between">
				<Button
					htmlType="submit"
					form="listen-and-fill-in-the-blanks-form"
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
			<AddMediaModal
				defaultMediaUrl={mediaUrl}
				isAudio={true}
				isOpenAddMediaModal={isOpenAddMediaModal}
				setIsOpenAddMediaModal={setIsOpenAddMediaModal}
				onSave={(fileId: string, fileUrl: string) => {
					form.setFieldValue([...selectedQuestionPath.current,'media'], fileId);
					form.setFieldValue([...selectedQuestionPath.current,'mediaUrl'], fileUrl);
				}}
			/>
		</>
	);
};

export default ListenAndFillInTheBlanksDrill;
