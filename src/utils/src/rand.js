export const rand = (min = 0, max = 9999) => Math.floor(Math.random() * (max - min)) + min

export const random_string = (length) => {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i += 1) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
export const random_date = () => new Date(+(new Date()) - Math.floor(Math.random()*10000000000))

export const random_user_image = (gender = 'male') => {
    gender = gender || 'male'
    gender = gender.trim().toLowerCase()
    const type = gender === 'female' ? 'women' : 'men'
    return `https://randomuser.me/api/portraits/${type}/${rand(1, 99)}.jpg`
    // return `https://uinames.com/api/photos/${gender}/${rand(1, 20)}.jpg`
}

export const random_image = (w = 400, h = 200) => {
    const nocache = Date.now()
    return `https://picsum.photos/${w}/${h}?_=${nocache}`
}

export const random_color = () => `rgb(${[...new Array(3)].map(() => Math.random() * 256).join(',')})`
