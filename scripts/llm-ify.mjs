import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'

// Define the output file name
const outputFile = './combined_code.txt'

// Define the directories to search (you can add more directories)
const directories = ['./src']

let combinedCode =
  'You are a 10x coder. Help this junior developer develop this reference checking app.\n\n// --- Combined Code ---\n\n'

// Recursive function to traverse directories and read files
const readFilesRecursively = (dir) => {
  // Check if the directory exists
  try {
    const files = readdirSync(dir)

    files.forEach((file) => {
      const filePath = join(dir, file)

      // Get file stats to check if it's a directory or a file
      const stats = statSync(filePath)

      // If it's a directory, recursively read its contents
      if (stats.isDirectory()) {
        console.log(`Reading directory: ${filePath}`)
        readFilesRecursively(filePath)
      } else {
        // If it's a file, check if it's of the desired type
        if (
          file.endsWith('.js') ||
          file.endsWith('.ts') ||
          file.endsWith('.jsx') ||
          file.endsWith('.tsx')
        ) {
          console.log(`Reading file: ${filePath}`)
          const fileContent = readFileSync(filePath, 'utf-8')
          combinedCode += `\n\n// --- ${filePath} ---\n\n` + fileContent
        }
      }
    })
  } catch (error) {
    console.error('Error reading directory:', error)
  }
}

// Iterate through the directories and process files
directories.forEach((dir) => {
  console.log(`Starting to read from directory: ${dir}`)
  readFilesRecursively(dir)
})



// add README file
// Ask user if README should be included

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Wrap in a promise to handle the asynchronous readline
await new Promise((resolve) => {
  rl.question('Include README.md in the combined file? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const readmePath = './README.md'
      if (statSync(readmePath).isFile()) {
        console.log(`Reading file: ${readmePath}`)
        const readmeContent = readFileSync(readmePath, 'utf-8')
        combinedCode += `\n\n// --- ${readmePath} ---\n\n` + readmeContent
      } else {
        console.log(`File not found: ${readmePath}`)
      }
    } else {
      console.log('Skipping README.md')
    }
    resolve()
  })
})

// Ask user if package.json should be included
await new Promise((resolve) => {
  rl.question(
    'Include package.json in the combined file? (y/n): ',
    (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const packageJsonPath = './package.json'
        if (statSync(packageJsonPath).isFile()) {
          console.log(`Reading file: ${packageJsonPath}`)
          const packageJsonContent = readFileSync(packageJsonPath, 'utf-8')
          combinedCode +=
            `\n\n// --- ${packageJsonPath} ---\n\n` + packageJsonContent
        } else {
          console.log(`File not found: ${packageJsonPath}`)
        }
      } else {
        console.log('Skipping package.json')
      }
      rl.close()
      resolve()
    }
  )
})

// Write the combined code to a single file
writeFileSync(outputFile, combinedCode, 'utf-8')
console.log('Code successfully combined into:', outputFile)
