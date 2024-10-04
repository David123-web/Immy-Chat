const { google } = require('googleapis');
const fs = require('fs');

export function getGGDriveInstance(
    clientId: string,
    clientSecret: string,
    refreshToken: string
) {
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        REDIRECT_URI
    );
    oauth2Client.setCredentials({
        refresh_token: refreshToken 
    });

    return google.drive({
        version: 'v3',
        auth: oauth2Client,
    });
}

export async function listFiles(
    drive: any,
    pageSize = 10,
    pageToken = undefined,
    folderId
) {
    const res = await drive.files.list({
        q: folderId ? `'${folderId}' in parents and trashed=false` : undefined,
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(id, name, size, createdTime)',
    });
    const result = res.data;
    console.log(result);
    return result;
}

export async function listFolders(
    drive: any,
    pageSize = 10,
    pageToken: string,
    folderId: string
) {
    const res = await drive.files.list({
        q:
      'mimeType=\'application/vnd.google-apps.folder\'' +
      (folderId ? ` and '${folderId}' in parents and trashed=false` : ''),
        pageSize,
        pageToken,
    });
    const result = res.data;
    console.log(result);
    return result;
}

export async function downloadFile(drive: any, res: any, fileId: string) {
    try {
        const info = await drive.files.get({
            fileId,
            fields: 'id, name, parents',
        });
        const file = await drive.files.get(
            {
                fileId,
                alt: 'media',
            },
            {
                responseType: 'stream' 
            }
        );
        console.log(file);
        return [info.data.name, file];
    } catch (err) {
    // TODO(developer) - Handle error
        throw err;
    }
}

export async function createFile(
    drive: any,
    name: string,
    stream: any,
    mimeType: string,
    folderId: string
) {
    const requestBody = {
        name,
        parents: folderId ? [folderId] : undefined,
    };
    const media = {
        mimeType,
        body: stream,
    };
    try {
        const file = await drive.files.create({
            requestBody,
            media,
            fields: 'id',
        });
        console.log('File Id:', file.data.id);
        return file.data.id;
    } catch (err) {
    // TODO(developer) - Handle error
        throw err;
    }
}

export async function createFolder(drive: any, name: string, folderId: string) {
    const fileMetadata = {
        name,
        parents: folderId ? [folderId] : undefined,
        mimeType: 'application/vnd.google-apps.folder',
    };
    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });
        console.log('Folder Id:', file.data.id);
        return file.data.id;
    } catch (err) {
    // TODO(developer) - Handle error
        throw err;
    }
}

export async function moveFileToFolder(
    drive: any,
    fileId: string,
    folderId: string
) {
    try {
    // Retrieve the existing parents to remove
        const file = await drive.files.get({
            fileId: fileId,
            fields: 'parents',
        });

        // Move the file to the new folder
        const previousParents = file.data.parents
            .map(function (parent) {
                return parent.id;
            })
            .join(',');
        console.log(previousParents);
        const files = await drive.files.update({
            fileId: fileId,
            addParents: folderId ? [folderId] : undefined,
            removeParents: previousParents,
            fields: 'id, parents',
        });
        console.log(files);
        return files.status;
    } catch (err) {
    // TODO(developer) - Handle error
        throw err;
    }
}
export async function renameFile(drive: any, fileId: string, name: string) {
    try {
        const files = await drive.files.update({
            fileId: fileId,
            resource: {
                name 
            },
            fields: 'id, parents',
        });
        console.log(files);
        return files;
    } catch (err) {
    // TODO(developer) - Handle error
        throw err;
    }
}

export async function deleteFile(drive: any, fileId: string) {
    return drive.files.delete({
        fileId: fileId,
    });
}

// // listFiles(1,"~!!~AI9FV7RVO5VAyYQ-f9A_5_7c3KHw5ZeOc6GrNcyaeThijXcFqzHqZt1VlO6goHg8VxuxzN8EPoqOswB4rHiexRl8j1CrK-9cAYJYZRzS-f52mjgCRAPZJOg3Bk9xelJ02w-UtDTUA3dbghwwYuuhTBSW1aiyvb8zwnIHPX5YB11GZUKcXXmFMGYAkuNPqmNf9vHD-t2f_mYg_Zz1_BgEyRT5Ph94M6jx9J_p05TjyriEtjqLJ2zInCfJtSYnt48XihBwtsQqtR8FiaOoJ277nDjHJHgJJSQw35qkBqO-nhdz8SUNg-rx3168_uIBP1SQyh9a4suxMH-i");
// // listFiles(10, undefined, "1sb3_N5JLAWX3Tz6lH_fyMYGjeqy71Aru")
// downloadFile("1-FfF0u9RjQEt7dseXT2CPTdoYoO4KhxX");
