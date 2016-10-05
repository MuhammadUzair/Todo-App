class ToDo {
	private task:string = "",
	 		taskList:string[];
	public taskNo:number;
	public countTaskELm;

	cookieLength():number {
		var cookies = this.getCookie('task-');

		this.taskNo = cookies.length;
		return this.taskNo;
	}

	constructor(list, countTaskELm) {
		var cookies = this.getCookie('task-');
		
		this.countTaskELm = countTaskELm;
		this.getTaskList(list);

		cookies.sort();

		if (cookies.length > 0) {
			var cookLen = cookies.length;
			this.taskCount(this.countTaskELm, cookLen, '('+cookLen+')');
			document.getElementById('small').remove();

			for (var i=0; i<cookLen; i++) {
				var cookie = cookies[i].split('=');
				var name = cookie[0];
				var task = cookie[1];
				var taskNo = (name.split('-').pop());

				this.addHtml(task, taskNo, list);
			}
		}
	}

	getTaskList(list) {
		var elm = list[0].childNodes;
		var taskList = [];

		for (var i=0; i < elm.length; i++) {
			if (elm[i].nodeName == 'UL') {
				taskList.push(elm[i]);
			}
		}

		this.taskNo = taskList.length;
		this.taskList = taskList;

	}

	getTask(task) {
		var val = task.value;

		if (val.length > 0) {
			this.task = val.trim();
		}
	}

	addTask(list, message, taskBox) {
		var task = this.task;		
		var err = this.alert('danger', 'Please type in the task field');
		var success = this.alert('success', 'Task added successfully');

		if (task.length > 0) {
			message.innerHTML = success

			setTimeout(function () {
				message.innerHTML = "";
			}, 5000);

			this.getTaskList(list);

			var taskList = this.taskList;
			var taskNo = this.taskNo+1;

			if (taskNo > 0) {
	    		document.cookie = "task-"+taskNo+"="+task;
				this.taskCount(this.countTaskELm, taskNo, '('+taskNo+')');
				this.addHtml(task, taskNo, list);
				taskBox.value = "";
				this.task = "";
				document.getElementById('small').remove();
			}
		}else {
			message.innerHTML = err;
		}
	}

	addHtml(task:string, taskNo:number, list) {
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'task-'+taskNo);

		this.taskSnippet(task, taskNo, ul);

		list[0].appendChild(ul);
		
	}

	taskSnippet(task, taskNo, ul) {
		var name = document.createElement("li");
		name.setAttribute('id', 'task-'+taskNo);
		
		var dlt = document.createElement("li");
		var taskName = document.createTextNode(task);
		var edit = document.createElement('i');

		var text = document.createTextNode('mode_edit');
		edit.appendChild(text);

		edit.setAttribute('class', 'small material-icons edit');
		this.setAttributes(edit, {
			'title': 'Edit',
			'id': 'edit-task-'+taskNo
		});

		var dltbtn = document.createElement('button');
		this.setAttributes(dltbtn, {
			'task-id': 'task-'+taskNo,
			'title': 'Trash',
			'class': 'round btn btn-danger'
		});

		var icon = document.createElement('i');
		this.setAttributes(icon, {
			'task-id': 'task-'+taskNo,
			'class': 'glyphicon glyphicon-trash',
		})

		dltbtn.appendChild(icon);

		name.appendChild(taskName);
		name.appendChild(edit);
		dlt.appendChild(dltbtn);

		ul.appendChild(name);
		ul.appendChild(dlt);
	}

	deleteTask(list) {
		var tasks = list[0];


		tasks.onclick = (e) => {
			var target = e.target || e.srcElement;
			var cookie = target.attributes[0].value;
			var now = <any>new Date();
			
			console.clear();						

			if (cookie.indexOf('task-') == 0) {
				now.setDate(now.getDate());

				var cookies = this.getCookie(cookie, 'yes');
				// name = cookie[0];
				var value = cookie[1];
				
				// now.toGMTString()
				if (document.cookie = cookie+"="+value+";expires="+now.toGMTString()) {
					var success = "<small class='delete-success alert alert-success'>";
						success += "<i class='glyphicon glyphicon-ok'></i>";
						success += " Your task deleted successfully</small>";
					
					document.getElementsByClassName(cookie)[0].innerHTML = success;
					
					this.getTaskList(list);

					setTimeout(function (taskNo, countTaskELm, taskCount) {
						document.getElementsByClassName(cookie)[0].remove();
						taskNo--;

						taskCount(countTaskELm, taskNo, '('+taskNo+')');

						if (taskNo == 0) {
							tasks.innerHTML = "<small id='small'>Nothing at the moment</small>";								
						}
					}, 2000, this.taskNo, this.countTaskELm, this.taskCount);

					window.onmouseover = () => {
						var taskNo = this.cookieLength();
						this.taskCount(this.countTaskELm, taskNo, '('+taskNo+')');

						if (this.taskNo == 0) {
							tasks.innerHTML = "<small id='small'>Nothing at the moment</small>";								
						}

						console.clear();						
					}
				}

			}
		};
	}

	getCookie(name:string, split:string = 'no') {
		var cookie = document.cookie;
		var pieces = <any>cookie.split(';');
		var array = [];

		for (var i=0; i<pieces.length; i++) {
			var found = pieces[i].trim();
			if (found.indexOf(name) == 0) {
				if (split == 'yes') {
					var piece = found.split('=');
				}else {
					array.push(found);
				}

			}
		}

		return (split == 'yes') ? piece : array;
	}

	taskCount(elm, taskCount, output) {
		if (taskCount > 0) {
			elm.innerHTML = output
		}else {
			elm.innerHTML = '';
		}
	}

	alert(type:string, message:string) {
		var icon = (type == 'danger') ? 'exclamation-sign' : 'ok' ;

		var html = "<p class='alet alert-"+type+"'>";
			html += "<span class='step size-21' aria-hidden='true'>";
		    html += "<i class='glyphicon glyphicon-"+icon+"'></i>";
			html += "</span> "+message+"</p>";

		return html;
	}

	edit(tasks) {
		tasks[0].onmouseover = (e) => {
			var target = e.target || e.srcElement;
			var attr = target.attributes[2].value;

			console.clear();
			
			if (attr.lastIndexOf('edit-task-') != -1) {
				var edit = document.getElementById(attr);

				this.doEdit(attr, edit);
			}
		}
	}

	doEdit(task:string, edit) {
		task = task.replace('edit-', '');
		var taskToEdit = document.getElementsByClassName(task)[0];
		var  taskname = this.getCookie(task, 'yes')[1]; // error
		var inputClass = 'field-'+task;
		var taskNo = task.split('-').pop();

		edit.onclick = () => {
			var editBox = document.createElement('li');
			editBox.setAttribute('id', 'edit-'+task);

			var cancelLi = document.createElement('li');
			var cancelBtn = document.createElement('button');
			this.setAttributes(cancelBtn, {
				'title': 'Cancel',
				'id': 'cancel-'+task,
				'class': 'round btn btn-danger',
			});
			var cancelIco = document.createElement('i');
			this.setAttributes(cancelIco, {
				'id': 'cancel-'+task,
				'class': 'glyphicon glyphicon-remove'
			});

			var editInp = document.createElement('input');
				this.setAttributes(editInp, {
					'type': 'text',
					'autcomplete': 'off',
					'value': taskname,
					'maxlength': 60,
					'placeholder': 'Edit Task',
					'id': 'task',
					'class': inputClass
				});
				
			var editBtn = document.createElement('button');
		    this.setAttributes(editBtn, {
		    	'class': 'btn btn-default save-edit-'+task,
		    	'title': 'Save Edit',
		    	'id': 'btn'
		    });

		    var icon = document.createElement('i');
		    icon.setAttribute('class', 'small material-icons save-edit-'+task);
		    var icoText = document.createTextNode('mode_edit');
		    
		    icon.appendChild(icoText);
		    editBtn.appendChild(icon);
		    cancelBtn.appendChild(cancelIco);
		    editBox.appendChild(editInp);
		    editBox.appendChild(editBtn);
		    cancelLi.appendChild(cancelBtn);

		    taskToEdit.innerHTML = "";
		    taskToEdit.appendChild(editBox);
		    taskToEdit.appendChild(cancelLi);

		    var input = document.getElementsByClassName(inputClass)[0];			
		    var cancel = document.getElementById('cancel-'+task);

			cancel.onclick = () => {
				taskToEdit.innerHTML = '';
				this.taskSnippet(taskname, taskNo, taskToEdit);
			};

			input.onkeyup = () => {
				editedTask = input.value.trim();
				
				if (editedTask.length > 0) {
					this.editCookie(task, editedTask, taskNo, taskToEdit);
				}else {
					// return false;
				}
			}
		}
	}

	setAttributes(el, attrs) {
	  	for(var key in attrs) {
	 	   el.setAttribute(key, attrs[key]);
	 	 }
	}

	editCookie(task, editedTask, taskNo, taskToEdit) {
		var saveBtn = document.getElementsByClassName('save-edit-'+task)[0];

		saveBtn.onclick = () => {
			taskToEdit.innerHTML = '';
			var editBox = document.getElementsByClassName('edit-'+task)[0];

			document.cookie = task+"="+editedTask;
			this.taskSnippet(editedTask, taskNo, taskToEdit)
		}
	}
}

window.onload = () => {
	var task = document.getElementById('task');
	var add = document.getElementById('btn');
	var message = document.getElementById('message');
	var list = document.getElementsByClassName('list');
	var taskCountElm = document.getElementById('task-count');
	
	var todo = new ToDo(list, taskCountElm);

	task.onkeyup = () => {
		todo.getTask(task);

		add.onclick = () => {
			todo.addTask(list, message, task);
		};


		window.onmouseover = () => {
			if (list[0].childElementCount == 0) {
				list[0].innerHTML = "<small id='small'>Nothing at the moment</small>";
			}
		}
	};

	todo.deleteTask(list);
	todo.edit(list);

	window.onmouseover = () => {
		console.clear();
		var taskCount =  todo.cookieLength();
		todo.taskCount(taskCountElm, taskCount, '('+taskCount+')');
	}
};
