import { Avatar } from 'antd';
import React from 'react';

interface IUserAvatar {
  avatarUrl : string;
  userName: string
}

const UserAvatar = (props: IUserAvatar) => {
  const {avatarUrl,userName,} = props
	return (
		<div className="tw-ml-2 tw-text-base tw-flex tw-items-center tw-border tw-border-stone-300 tw-border-solid tw-rounded-md">
			<Avatar
				className="tw-mx-2 tw-my-1"
				size="default"
				src={
					<img
						src={avatarUrl}
						alt="avatar"
					/>
				}
			/>
			<div className="tw-w-40 tw-truncate">{userName}</div>
		</div>
	);
};

export default UserAvatar;
