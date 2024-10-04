export const handleDownloadFile = async ({ linkFile, name, ext }: { linkFile: string; name: string; ext: string }) => {
	const response = await fetch(linkFile);
	const fileBlob = await response.blob();
	const fileUrl = URL.createObjectURL(fileBlob);
	const link = document.createElement('a');
	link.href = fileUrl;
	link.setAttribute('download', `${name}.${ext}`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(fileUrl);
};
