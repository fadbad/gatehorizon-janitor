import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

const initialState = {
	edges: [],
	page_info: {
		end_cursor: '',
		has_next_page: false,
		start_cursor: '',
	},
};

const defaultConfig = {
	first: 100,
	groupTypes: 'All', // All, Album, Event, Faces, Library, PhotoStream, SavedPhotos
	assetType: 'Photos', // All, Videos, Photos (default)
};

export default function useCameraRoll() {
	const [photos, setPhotos] = useState(initialState);
	const [albums, setAlbums] = useState(false); // [{title, count}]

	async function getPhotos(config = defaultConfig) {
		try {
			const photos = await CameraRoll.getPhotos(config);
			setPhotos(photos);
		} catch (err) {
			console.log('error: ', err);
		}
	}

	async function getAlbums(type = 'All') {
		// All, Photos, Videos
		try {
			const albums = await CameraRoll.getAlbums({assetType: type});
			setAlbums(albums);
		} catch (err) {
			console.log('error: ', err);
		}
	}

  	async function hasAndroidPermission() {
		const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

		const hasPermission = await PermissionsAndroid.check(permission);
		if (hasPermission) return true;

		const status = await PermissionsAndroid.request(permission);
		return status === 'granted';
  	}

	async function saveAndroid(file) {
		if (!(await hasAndroidPermission())) return;
		const time = new Date().getTime();
		const {config, fs} = RNFetchBlob;
		const dir = fs.dirs.DownloadDir;
		const path = dir + '/' + time + '-' + file.replace(/.*\//, '');
		try {
			const res = await config({path: path, fileCache: true}).fetch(
				'GET',
				file,
			);
			return res.data;
		} catch (err) {
			console.log('error downloading: ', err);
		}
	}

	async function saveToCameraRoll(tag) {
		if (Platform.OS === 'android') {
			const file = await saveAndroid(tag);
			tag = `file://${file}`;
			console.log('TAG', tag);
		}
		try {
			await CameraRoll.save(tag);
		} catch (err) {
			console.log('error saving to camera roll: ', err);
		}
	}

	return {
		photos,
		getPhotos,
		albums,
		getAlbums,
		saveToCameraRoll,
	};
}
