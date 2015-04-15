//fixed
//Q1:cwd什么意思    A:相对于src的询问路径(一言以蔽之：在cwd下找src的内容)
//Q2:怎么写后缀名   A:ext属性指定后缀名，extDot属性(first,last)指定从哪个'.'开始修改后缀
//Q3:为什么不能copy  A:task里没有target

//todo

module.exports = function(grunt){

    // require('time-grunt')(grunt);

    /* load npm tasks */
    require('load-grunt-tasks')(grunt);

    var config = {
        app:'src',
        dist:'dist'
    }


	/* last modified time 暂时没用*/
	function lastModified(minutes) {
		return function(filepath) {
			var filemod = (require('fs').statSync(filepath)).mtime;
			var timeago = (new Date()).setDate((new Date()).getMinutes() - minutes);
			return (filemod > timeago);
		}
	}

	//grunt init config
    grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
        config:config,
        sass:{
        	dist:{
        		files:[
        			{
        				expand:true,
        				cwd:'src/',		//Q1
        				src:['**/*.sass','**/*.css','**/*.scss'],
        				dest:'dist/',
                        ext:'.css'
        			}
        		]
        	}
        },
        uglify:{//压缩
        	options:{
        		banner:'/*! <%= config.app %> <%= grunt.template.today() %> */\n'
        	},
        	dist:{
        		files:[
	        		{
	        			expand: true,     // Enable dynamic expansion.
						cwd: 'dist/',	//Q1
						src: ['<%= config.app %>.js'], // Actual pattern(s) to match.
						dest:'dist/<%= config.app %>',
						ext:['.min.js','.min.css'], //Q2
                        extDot:'last'
	        		}

	        		//another way
	        		// 'dist/<%= config.app %>.min.js' : ['<%= concat.dist.dest %>'],
	        		// 'dist/**/*.min.css' : ['src/**/*.css']
        		]

        		// another way
        		// src:[<%= concat.dist.dest %>],
        		// dest:'dist/<%= config.app %>.min.js'
        	}
        },
        concat:{//拼接、合并
        	options:{
        		separator:';'
        	},
        	dist:{
        		cwd:'dist/',
        		src:['**/*.js'],
        		dest:'dist/<%= config.app %>.js'
        	}
        },
        copy:{
            dist:{
                expand:true,
                cwd:'src/',
                src:['**/*.js'],
                dist:'dist/'
            }
        },
        watch:{
            scripts:{
                files:['src/**/*.js'],
                tasks:['newer:copy:def']
            }
            css:{
                files:'src/**/*.{css,scss,sass}',
                tasks:['newer:sass']
            },
            images:{
                files:[{
                    expand:true,
                    cwd:'src/',
                    src:'**/*.{png,jpg,gif}',
                    dist:'dist/'
                }],
                tasks:['newer:copy']
            }
        }
    });

	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// ...

    /* 
        组合的task 
        method1 : array
        method2 : function
    */
	grunt.registerTask('default', ['watch']);

    // grunt.registerTask('default',function (target) {
    //     //target: task name        
    //     grunt.task.run(['clean','concurrent:develop']);

    // });
	//...
}
