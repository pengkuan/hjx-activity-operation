const adPosSet = resolve => require(['@/views/adPosition/adPosSet'], resolve) 
const add = resolve => require(['@/views/adPosition/add'], resolve) 
const detail = resolve => require(['@/views/adPosition/detail'], resolve) 
const edit = resolve => require(['@/views/adPosition/edit'], resolve)  

export default {
	adPosSet,
	add,
	detail,
	edit
}