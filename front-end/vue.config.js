// module.exports = {
// 	devServer: {
// 		proxy: 'http://localhost:3002',
// 	}
// }
module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://localhost:3003',
        },
      }
    }
  }
  
