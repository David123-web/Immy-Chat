import { useMobXStores } from '@/src/stores';
import { Form, Select, Tag } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ITeacherSubForm } from './AboutForm';

const QualificationsForm = (props: ITeacherSubForm) => {
	const { globalStore } = useMobXStores();

	const [langSelected, setLangSelected] = useState<string[]>([]);

	const handleChange = (value: number[]) => {
		setLangSelected(value.map((item) => globalStore.courseLanguages.find((lang) => lang.id === item).name));
	};

	const onFinish = (data: any) => {
		props.setCurrentStep(2);
		props.setStorageData((prev) => ({ ...prev, ...data }));
	};

	return (
		<Form layout="vertical" form={props.formInstance} onFinish={onFinish}>
			<Form.Item
				name="qualificationDesc"
				rules={[
					{
						required: true,
						message: 'Please provide a qualification description.',
					},
					{
						max: 150,
						message: 'The qualification description should not exceed 150 characters.',
					},
				]}
				label="Explain your qualifications and list any achievements to teach language courses on this platform."
			>
				<TextArea
					placeholder="For example: I have taught this language for 5 years professionally. I am a native speaker. I have published content in or about the language."
					rows={4}
				/>
			</Form.Item>
			<Form.Item
				name="experienceDesc"
				rules={[
					{
						required: true,
						message: 'Please provide a experience description.',
					},
					{
						max: 150,
						message: 'The experience description should not exceed 150 characters.',
					},
				]}
				label="Describe your experience or exposure to using conversational means to teach languages."
			>
				<TextArea
					placeholder="For example: I’ve included four skill-building components in all of my English lessons, including speaking."
					rows={4}
				/>
			</Form.Item>
			{/* <Form.Item
				name="relatedMaterialDesc"
				rules={[
					{
						required: true,
						message: 'Please provide a related material description.',
					},
					{
						max: 150,
						message: 'The related material description should not exceed 150 characters.',
					},
				]}
				label="List which curricula, textbooks, courses, or similar content you have used for language instruction, whether formally or informally."
			>
				<TextArea
					placeholder="While we provide support and tiered coaching to transform content as needed into courses and lessons, it is nevertheless necessary to begin with a resource or content you wish to share.."
					rows={4}
				/>
			</Form.Item> */}
			<Form.Item
				name="teachLanguages"
				rules={[
					{
						required: true,
					},
				]}
				label="Which language do you teach? (Can be more than 1 language)"
			>
				<Select
					showSearch
					mode="multiple"
					placeholder="Select your language"
					filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
					options={globalStore.courseLanguages.map((l) => ({
						value: l.id,
						label: l.name,
					}))}
					onChange={handleChange}
				/>
			</Form.Item>
			{langSelected.map((lang) => (
				<Tag key={lang} color="#005F56">
					{lang}
				</Tag>
			))}
		</Form>
	);
};

export default observer(QualificationsForm);
