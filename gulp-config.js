module.exports = {
  task: {
    lintJs: 'lint-js',
    fixJs: 'fix-js',
    buildJs: 'build-js',
    cleanBuild: 'clean-build',
    watch: 'watch',
    build: 'build',
  },
  folder: {
    tasks: 'tasks',
    src: 'src',
    build: 'dist',
  },
  file: {
    mainJs: 'filter-inputs-url',
    mainJsMin: 'filter-inputs-url.min',
  },
  error: {
    sound: true,
    title: '< SYSTEM ERROR >',
    icon: './system_files/icons/error_icon.png',
    wait: true,
  },
  isProduction() {
    return process.argv[process.argv.length - 1] === this.task.build;
  },
  isFixJs() {
    return process.argv[process.argv.length - 1] === this.task.fixJs;
  }
};
