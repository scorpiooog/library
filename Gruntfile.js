//Q1:cwd什么意思
//Q2:怎么写后缀名

module.exports = function(grunt){
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
		pkg: grunt.file.readJSON('package.json'),
        sass:{
        	dist:{
        		files:[
        			{
        				expand:true,
        				cwd:'src/',		//Q1
        				src:['**/*.sass','**/*.css'],
        				dest:'dist/'
        			}
        		]
        	}
        },
        uglify:{//压缩
        	options:{
        		banner:'/*! <%= pkg.name %> <%= grunt.template.tody(yyyy-mm-dd) %> */\n'
        	},
        	dist:{
        		files:[
	        		{
	        			expand: true,     // Enable dynamic expansion.
						cwd: 'dist/',	//Q1
						src: ['<%= concat.dist.dest %>','**/*.css'], // Actual pattern(s) to match.
						dest:'dist/',
						ext:['.min.js','.min.css'] //Q2

						// filter: lastModified(2)
	        		}

	        		//another way
	        		// 'dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>'],
	        		// 'dist/**/*.min.css' : ['src/**/*.css']
        		]

        		// another way
        		// src:[<%= concat.dist.dest %>],
        		// dest:'dist/<%= pkg.name %>.min.js'
        	}
        },
        concat:{//拼接、合并
        	options:{
        		separator:';'
        	},
        	dist:{
        		cwd:'dist/',
        		src:['**/*.js'],
        		dest:'dist/<%= pkg.name %>.js'
        	}
        },
        watch:{

        }    
    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	// ...

	grunt.registerTask('default', ['clean', 'concurrent:develop']);
	//...
}
