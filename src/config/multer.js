import { diskStorage } from 'multer'
import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, './../../.env') })

const storagePaths = {
  PROD: join(__dirname, '../../../uploads'),
  DEV: join(__dirname, '../../uploads'),
}

const storage = diskStorage({
  destination: function (req, file, callback) {
    try {
      const env = process.env.VERSION === 'PROD' ? 'PROD' : 'DEV'
      const destinationPath = storagePaths[env]
      callback(null, destinationPath)
    } catch (error) {
      callback(error)
    }
  },
  filename: function (req, file, callback) {
    try {
      const nameAndExtension = file.originalname.split(' - ')[0]
      const [name, extension] = nameAndExtension.split('.')
      const uniqueSuffix = crypto.randomBytes(8).toString('hex')
      callback(null, `${name}-${uniqueSuffix}.${extension}`)
    } catch (error) {
      callback(error)
    }
  },
})

export const upload = multer({ storage })
