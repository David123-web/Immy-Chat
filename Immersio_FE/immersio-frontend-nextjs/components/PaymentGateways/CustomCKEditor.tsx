import { FormInstance } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface ICustomCKEditorProps {
	form: FormInstance;
	name: string;
	initialContent?: string;
	placeholder?: string;
}

export default function CustomCKEditor(props: ICustomCKEditorProps) {
	const { form, name, initialContent, placeholder = '' } = props;

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
		if (initialContent) {
			setContent(initialContent);
		} else if (placeholder) {
			setContent(placeholder);
		}
	}, [initialContent]);

	return editorLoaded ? (
		<CKEditor
			editor={ClassicEditor}
			onChange={(event, editor) => {
				setContent(editor.getData());
				form.setFieldValue(name, editor.getData());
			}}
			data={content}
		/>
	) : (
		<div>'Loading editor...'</div>
	);
}
