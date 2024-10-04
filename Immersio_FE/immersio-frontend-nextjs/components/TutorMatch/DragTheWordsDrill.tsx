import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Collapse, Input, Button } from 'antd';
import form from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import React, { useRef, useState } from 'react';
import AddMediaModal from './AddMediaModal';
import { IDrillData } from '@/src/interfaces/tutorMatch/tutorMatch.interface';

const { Panel } = Collapse;
interface IDragTheWordsDrill {
	drillData: IDrillData[];
	onCancel: (cancel: boolean) => void;
	onSave: (drilData: IDrillData[]) => void;
}

const DragTheWordsDrill = (props: IDragTheWordsDrill) => {
	const { drillData, onCancel, onSave } = props;
	const [form] = Form.useForm();
	
	const onFinish = (values: any) => {
		const newDrillData = values.questions.map((card, index) => {
			return {
				id: index + 1,
				order: index,
				question: card.question,
				content: [],
				correctIndex: 0,
			};
		});
		onSave(newDrillData);
	};

	return (
		<>
			<Form form={form} name="drag-the-words-form" onFinish={onFinish} autoComplete="off">
				<Form.List name="questions"  initialValue={drillData.map((question) => {
					return {
						question: question.question
					};
				})}>
					{(fields, { add, remove }) => (
						<>
							<Collapse accordion>
								{fields.map((field) => (
									<Panel
										key={field.key}
										header={
											<div className="tw-flex tw-justify-between">
												<span>Box {field.name + 1}</span>
												<DeleteOutlined
													onClick={() => {
														console.log(field);
														remove(field.name);
													}}
												/>
											</div>
										}
									>
										<Form.Item {...field} name={[field.name, 'question']} className="tw-mb-2">
											<TextArea
                        style={{resize:"none"}}
												className="tw-w-full tw-border-dashed border-theme-6 tw-border-2 tw-px-4 tw-py-2"
												placeholder={`Enter your No.${field.name + 1} statement. Note that Droppable words are added with an asterisk (*) in front and behind the correct word/phrase.`}
											/>
										</Form.Item>
									</Panel>
								))}
							</Collapse>

							<Form.Item>
								<Button
									className="tw-w-full tw-rounded-md tw-font-semibold tw-text-lg tw-flex tw-items-center tw-py-6"
									onClick={() => add()}
									icon={
										<PlusOutlined className="bg-theme-4 color-theme-7 tw-text-xs tw-p-1 tw-rounded-2xl" />
									}
								>
									New box
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>

			<div className="tw-flex tw-justify-between">
				<Button
					htmlType="submit"
					form="drag-the-words-form"
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

export default DragTheWordsDrill;
