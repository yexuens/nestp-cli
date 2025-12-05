import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';
import * as path from "node:path"; // 需要在 tsconfig 开启 json 导入
import fs from 'fs-extra';
import ejs from 'ejs';

const program = new Command();

program
    .name('nestp')
    .description('一个基于NestJS提供额外支持的CLI工具')
    .version(version);

program
    .command('schema <name>')
    .description('生成Drizzle ORM的Schema文件')
    .action(async (name: string) => {
        const start_time = Date.now();
        const first_upper_name = name.charAt(0).toUpperCase() + name.slice(1);
        const templatePath = path.join(__dirname, './templates/drizzle-schema.ejs');
        const targetPath = path.join(process.cwd(), `./${name}.ts`);
        try {
            // 3. 读取模板
            const templateContent = await fs.readFile(templatePath, 'utf-8');

            // 4. 渲染模板 (核心步骤)
            const result = ejs.render(templateContent, {
                name: name,
                first_upper_name: first_upper_name,
            });

            // 5. 写入文件 (fs-extra 会自动创建不存在的父级目录)
            await fs.outputFile(targetPath, result);

            console.log(chalk.green(`✅ 组件 ${name} 创建成功!\ncost: ${Date.now() - start_time}ms`));

        } catch (err) {
            console.error(chalk.red('创建失败'), err);
        }
    });

program.parse(process.argv);