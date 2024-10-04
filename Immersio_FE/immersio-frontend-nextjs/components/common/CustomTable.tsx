import SortArrow from '@/public/assets/img/mydrive/sortarrow.svg';
import { IHeaderTable } from '@/src/interfaces/mydrive/mydrive.interface';
import { Checkbox, Empty, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { overrideTailwindClasses } from 'tailwind-override';
import FileActionsModal from '../MyDrive/FileActionsModal';
import { useClickOutsideElement } from '@/hooks/useClickOutsideElement';

interface ICustomTable {
	columns: IHeaderTable[];
	data: any[] | null;
	className?: string;
	enableSort?: boolean;
	onClick?: () => void;
	onContextMenu?: () => void;
	onDoubleClick?: () => void;
	getIndexRowSelected?: (index: number) => void;
	getListIndexSelected?: (list: number[]) => void;
	isLoading: boolean;
	classNameRow?: string;
	contextContent?: React.ReactNode;
	getSortBy?: (key: string) => void;
	getSortDesc?: (isDesc: boolean) => void;
}

interface IRow {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

const Row = ({ children, className, onClick }: IRow) => (
	<div
		onClick={onClick}
		className={overrideTailwindClasses(`tw-flex tw-items-center tw-cursor-pointer tw-py-2 
	border-theme-6 tw-border-solid tw-border-0 tw-border-b-[1px] lg:tw-px-2 min-[1400px]:tw-px-6 ${className}`)}
	>
		{children}
	</div>
);

const CustomTable = (props: ICustomTable) => {
	const {
		columns,
		data,
		className,
		getIndexRowSelected,
		isLoading,
		onClick,
		onContextMenu,
		onDoubleClick,
		classNameRow = '',
		contextContent,
		getListIndexSelected,
		getSortBy,
		getSortDesc,
	} = props;

	const [listIndexSelected, setListIndexSelected] = useState<number[]>([]);
	const [indexRowSelected, setIndexRowSelected] = useState<number>(-1);
	const [positionModal, setPositionModal] = useState<{ x: number; y: number }>();
	const [isOpenActionsModal, setIsOpenActionsModal] = useState<boolean>(false);
	const [sortDesc, setSortDesc] = useState(false);

	useEffect(() => {
		setListIndexSelected([]);
	}, [isLoading]);

	const ref: any = useRef(null);

	// const downloadFileMutation = useMutation(getLinkFileById, {
	// 	onSuccess: (res) => {
	// 		handleDownloadFile({
	// 			linkFile: res.data,
	// 			name: currentFileSelected?.name,
	// 			ext: currentFileSelected?.ext,
	// 		});
	// 	},
	// 	onError: (err) => {
	// 		toast.error(err.data?.message);
	// 	},
	// });

	useClickOutsideElement(ref, () => {
		setIsOpenActionsModal(false);
	});

	const renderHeaders = (listHeader: IHeaderTable[]) => {
		return listHeader.map((header) => (
			<Row
				key={header.key as string}
				onClick={() => {
					if (header.enableSort) {
						getSortBy && getSortBy(header.key as string);
						setSortDesc((prev) => {
							getSortDesc(!prev);
							return !prev;
						});
					}
				}}
			>
				{header.label}
				{header.enableSort ? (
					<span className={`${sortDesc ? '' : 'tw-rotate-180'} tw-ml-4`}>
						<SortArrow />
					</span>
				) : null}
			</Row>
		));
	};

	const renderWidthCol = () => columns.map((col) => (col.widthGrid ? col.widthGrid : '1fr')).join(' ');

	const handleSelectRow = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
		if (e.shiftKey) {
			let listIndexShiftSelected = Array.from({ length: Math.abs(i - indexRowSelected) + 1 }, (_, index) =>
				indexRowSelected < i ? indexRowSelected + index : i + index
			);
			setListIndexSelected(listIndexShiftSelected);
			getListIndexSelected && getListIndexSelected(listIndexShiftSelected);
		} else {
			getListIndexSelected && getListIndexSelected([i]);
			setListIndexSelected([i]);
			setIndexRowSelected(i);
		}
		getIndexRowSelected && getIndexRowSelected(i);
	};

	const renderRows = (data: any[]) =>
		data.map((row, i) => (
			<div
				key={row.id}
				style={{
					display: 'grid',
					gridTemplateColumns: `3rem ${renderWidthCol()}`,
				}}
				className={overrideTailwindClasses(
					`tw-w-full tw-relative tw-transition-all hover-bg-theme-6 tw-select-none ${
						listIndexSelected.includes(i) ? 'bg-theme-6' : 'bg-white'
					}
					 ${classNameRow}`
				)}
				onClick={(e) => {
					handleSelectRow(e, i);
					onClick && onClick();
				}}
				onContextMenu={(e) => {
					setIsOpenActionsModal(false);
					const position = { x: e.clientX, y: e.clientY };
					setPositionModal(position);
					setTimeout(() => {
						setIsOpenActionsModal(true);
					}, 100);
					onContextMenu && onContextMenu();
					// getIndexRowSelected && getIndexRowSelected(i);
				}}
				onDoubleClick={(e) => {
					handleSelectRow(e, i);
					onDoubleClick && onDoubleClick();
				}}
			>
				<Row>
					<Checkbox
						checked={listIndexSelected.includes(i)}
						onChange={(e) => {
							e.target.checked
								? setListIndexSelected([...listIndexSelected, i])
								: setListIndexSelected(listIndexSelected.filter((item) => item !== i));
						}}
					/>
				</Row>
				{columns.map((col, ind) => (
					<Row key={ind} className={col.classNameRow}>
						<div className="tw-py-2 tw-w-full">{row[col.key]}</div>
					</Row>
				))}
			</div>
		));

	return (
		<div className={overrideTailwindClasses(`tw-flex tw-flex-col tw-relative ${className}`)}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: `3rem ${renderWidthCol()}`,
				}}
				className="tw-font-semibold tw-w-full"
			>
				<Row>
					<Checkbox
						checked={listIndexSelected.length === data?.length}
						onClick={() => {
							listIndexSelected.length === data?.length
								? setListIndexSelected([])
								: setListIndexSelected(Object.keys(data).map(Number));
						}}
					/>
				</Row>
				{renderHeaders(columns)}
			</div>
			{isLoading ? (
				<div className="tw-w-full tw-h-full tw-py-40 tw-flex tw-justify-center tw-items-center">
					<Spin size="large" />
				</div>
			) : data && data.length > 0 ? (
				<div className="tw-relative">
					{contextContent && (
						<div
							ref={ref}
							style={{
								position: 'fixed',
								top: positionModal?.y,
								left: positionModal?.x,
							}}
							className={`tw-transition-all tw-absolute tw-z-[1] tw-duration-75 ${
								isOpenActionsModal ? 'tw-opacity-100' : 'tw-opacity-0 tw-pointer-events-none'
							}`}
						>
							{contextContent}
						</div>
					)}
					{renderRows(data)}
				</div>
			) : (
				<div className="tw-w-full tw-h-full tw-py-10 tw-flex tw-justify-center tw-items-center">
					<Empty />
				</div>
			)}
		</div>
	);
};

export default CustomTable;
