import { useEffect, useRef, useState } from 'react';

interface ICustomCKEditorCourseProps {
	onChange: (value) => void;
	onBlur?: () => void;
	value?: string;
	placeholder?: string;
}

export default function CustomCKEditorCourse(props: ICustomCKEditorCourseProps) {
	const { onChange, onBlur, value, placeholder = '' } = props;

	const [editorLoaded, setEditorLoaded] = useState(false);
	const [content, setContent] = useState<string>();
	const editorRef = useRef<any>();
	const { CKEditor, ClassicEditor } = editorRef.current || {};

	useEffect(() => {
		editorRef.current = {
			CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
			ClassicEditor: require('/.ckeditor'),
		};
		setEditorLoaded(true);
	}, []);

	useEffect(() => {
		if (value) {
			setContent(value);
		}
	}, [value]);

	return editorLoaded ? (
		<CKEditor
			editor={ClassicEditor}
			onChange={(event, editor) => {
				setContent(editor.getData());
				onChange && onChange(editor.getData());
			}}
			onBlur={() => {
				onBlur && onBlur(); // Call the onBlur prop function here
			}}
			data={content}
			config={{ placeholder }} 
		/>
	) : (
		<div>'Loading editor...'</div>
	);
}
