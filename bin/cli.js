const colors = require('colors')
const inquirer = require('inquirer')
const path = require('path')
const fsExtra = require('fs-extra')
const fs = require('fs')
async function init () {
	const { productName } = await inquirer.prompt([
		{
			name: 'productName',
			type: 'input',
			message: '请输入将要创建的项目名称！',
			validate: function (val) {
				validateProductName(val, this.async())
			}
		}
	])
	if (productName) {
		copyProduct(productName)
		return
	}
}
async function validateProductName (val, done) {
	if (/[A-Za-z]{1}\w*/.test(val)) {
		const { isExists } = await exists(val)
		if (isExists) {
			done(`该路径下已存在${val}文件夹!`)
    	return
		} else {
			console.log(colors.green(`\n创建目录${val}成功！`))
			done(null, true)
		}
	} else {
		done('项目名不符合规范！， 匹配规则为/[A-Za-z]{1}\w*/')
    return
	}
}
async function copyProduct (productName) {
	fs.mkdirSync(`./${productName}`)
	// process.cwd() 当前node命令执行时所在的文件夹目录
	// __dirname 指被执行js文件所在的文件夹目录
	const cwd = process.cwd()
	try {
		await fsExtra.copy(
			path.resolve(__dirname, '../'),
			path.resolve(cwd, `./${productName}/`),
			{ filter (src, dest) {
				if (/[^]*\\base-web-cli\\node_modules[^]*/.test(src)) {
					return false
				}  else if (/[^]*\\base-web-cli\\bin[^]*/.test(src)){
					return false
				} else {
					return true
				}
			} })
	} catch (error) {
		console.log(error)
	}
}
function exists (productName) {
	return new Promise(resolve => {
		fs.exists(`./${productName}`, function (exists) {
			if (exists) {
				resolve({ isExists: true })
			} else {
				resolve({ isExists: false })
			}
		})
	})
}
module.exports = {
	init
}