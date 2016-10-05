var ToDo = (function () {
    function ToDo(list, countTaskELm) {
        this.task = "";
        var cookies = this.getCookie('task-');
        this.countTaskELm = countTaskELm;
        this.getTaskList(list);
        cookies.sort();
        if (cookies.length > 0) {
            var cookLen = cookies.length;
            this.taskCount(this.countTaskELm, cookLen, '(' + cookLen + ')');
            document.getElementById('small').remove();
            for (var i = 0; i < cookLen; i++) {
                var cookie = cookies[i].split('=');
                var name = cookie[0];
                var task = cookie[1];
                var taskNo = (name.split('-').pop());
                this.addHtml(task, taskNo, list);
            }
        }
    }
    ToDo.prototype.cookieLength = function () {
        var cookies = this.getCookie('task-');
        this.taskNo = cookies.length;
        return this.taskNo;
    };
    ToDo.prototype.getTaskList = function (list) {
        var elm = list[0].childNodes;
        var taskList = [];
        for (var i = 0; i < elm.length; i++) {
            if (elm[i].nodeName == 'UL') {
                taskList.push(elm[i]);
            }
        }
        this.taskNo = taskList.length;
        this.taskList = taskList;
    };
    ToDo.prototype.getTask = function (task) {
        var val = task.value;
        if (val.length > 0) {
            this.task = val.trim();
        }
    };
    ToDo.prototype.addTask = function (list, message, taskBox) {
        var task = this.task;
        var err = this.alert('danger', 'Please type in the task field');
        var success = this.alert('success', 'Task added successfully');
        if (task.length > 0) {
            message.innerHTML = success;
            setTimeout(function () {
                message.innerHTML = "";
            }, 5000);
            this.getTaskList(list);
            var taskList = this.taskList;
            var taskNo = this.taskNo + 1;
            if (taskNo > 0) {
                document.cookie = "task-" + taskNo + "=" + task;
                this.taskCount(this.countTaskELm, taskNo, '(' + taskNo + ')');
                this.addHtml(task, taskNo, list);
                taskBox.value = "";
                this.task = "";
                document.getElementById('small').remove();
            }
        }
        else {
            message.innerHTML = err;
        }
    };
    ToDo.prototype.addHtml = function (task, taskNo, list) {
        var ul = document.createElement("ul");
        ul.setAttribute('class', 'task-' + taskNo);
        this.taskSnippet(task, taskNo, ul);
        list[0].appendChild(ul);
    };
    ToDo.prototype.taskSnippet = function (task, taskNo, ul) {
        var name = document.createElement("li");
        name.setAttribute('id', 'task-' + taskNo);
        var dlt = document.createElement("li");
        var taskName = document.createTextNode(task);
        var edit = document.createElement('i');
        var text = document.createTextNode('mode_edit');
        edit.appendChild(text);
        edit.setAttribute('class', 'small material-icons edit');
        this.setAttributes(edit, {
            'title': 'Edit',
            'id': 'edit-task-' + taskNo
        });
        var dltbtn = document.createElement('button');
        this.setAttributes(dltbtn, {
            'task-id': 'task-' + taskNo,
            'title': 'Trash',
            'class': 'round btn btn-danger'
        });
        var icon = document.createElement('i');
        this.setAttributes(icon, {
            'task-id': 'task-' + taskNo,
            'class': 'glyphicon glyphicon-trash'
        });
        dltbtn.appendChild(icon);
        name.appendChild(taskName);
        name.appendChild(edit);
        dlt.appendChild(dltbtn);
        ul.appendChild(name);
        ul.appendChild(dlt);
    };
    ToDo.prototype.deleteTask = function (list) {
        var _this = this;
        var tasks = list[0];
        tasks.onclick = function (e) {
            var target = e.target || e.srcElement;
            var cookie = target.attributes[0].value;
            var now = new Date();
            console.clear();
            if (cookie.indexOf('task-') == 0) {
                now.setDate(now.getDate());
                var cookies = _this.getCookie(cookie, 'yes');
                // name = cookie[0];
                var value = cookie[1];
                // now.toGMTString()
                if (document.cookie = cookie + "=" + value + ";expires=" + now.toGMTString()) {
                    var success = "<small class='delete-success alert alert-success'>";
                    success += "<i class='glyphicon glyphicon-ok'></i>";
                    success += " Your task deleted successfully</small>";
                    document.getElementsByClassName(cookie)[0].innerHTML = success;
                    _this.getTaskList(list);
                    setTimeout(function (taskNo, countTaskELm, taskCount) {
                        document.getElementsByClassName(cookie)[0].remove();
                        taskNo--;
                        taskCount(countTaskELm, taskNo, '(' + taskNo + ')');
                        if (taskNo == 0) {
                            tasks.innerHTML = "<small id='small'>Nothing at the moment</small>";
                        }
                    }, 2000, _this.taskNo, _this.countTaskELm, _this.taskCount);
                    window.onmouseover = function () {
                        var taskNo = _this.cookieLength();
                        _this.taskCount(_this.countTaskELm, taskNo, '(' + taskNo + ')');
                        if (_this.taskNo == 0) {
                            tasks.innerHTML = "<small id='small'>Nothing at the moment</small>";
                        }
                        console.clear();
                    };
                }
            }
        };
    };
    ToDo.prototype.getCookie = function (name, split) {
        if (split === void 0) { split = 'no'; }
        var cookie = document.cookie;
        var pieces = cookie.split(';');
        var array = [];
        for (var i = 0; i < pieces.length; i++) {
            var found = pieces[i].trim();
            if (found.indexOf(name) == 0) {
                if (split == 'yes') {
                    var piece = found.split('=');
                }
                else {
                    array.push(found);
                }
            }
        }
        return (split == 'yes') ? piece : array;
    };
    ToDo.prototype.taskCount = function (elm, taskCount, output) {
        if (taskCount > 0) {
            elm.innerHTML = output;
        }
        else {
            elm.innerHTML = '';
        }
    };
    ToDo.prototype.alert = function (type, message) {
        var icon = (type == 'danger') ? 'exclamation-sign' : 'ok';
        var html = "<p class='alet alert-" + type + "'>";
        html += "<span class='step size-21' aria-hidden='true'>";
        html += "<i class='glyphicon glyphicon-" + icon + "'></i>";
        html += "</span> " + message + "</p>";
        return html;
    };
    ToDo.prototype.edit = function (tasks) {
        var _this = this;
        tasks[0].onmouseover = function (e) {
            var target = e.target || e.srcElement;
            var attr = target.attributes[2].value;
            console.clear();
            if (attr.lastIndexOf('edit-task-') != -1) {
                var edit = document.getElementById(attr);
                _this.doEdit(attr, edit);
            }
        };
    };
    ToDo.prototype.doEdit = function (task, edit) {
        var _this = this;
        task = task.replace('edit-', '');
        var taskToEdit = document.getElementsByClassName(task)[0];
        var taskname = this.getCookie(task, 'yes')[1]; // error
        var inputClass = 'field-' + task;
        var taskNo = task.split('-').pop();
        edit.onclick = function () {
            var editBox = document.createElement('li');
            editBox.setAttribute('id', 'edit-' + task);
            var cancelLi = document.createElement('li');
            var cancelBtn = document.createElement('button');
            _this.setAttributes(cancelBtn, {
                'title': 'Cancel',
                'id': 'cancel-' + task,
                'class': 'round btn btn-danger'
            });
            var cancelIco = document.createElement('i');
            _this.setAttributes(cancelIco, {
                'id': 'cancel-' + task,
                'class': 'glyphicon glyphicon-remove'
            });
            var editInp = document.createElement('input');
            _this.setAttributes(editInp, {
                'type': 'text',
                'autcomplete': 'off',
                'value': taskname,
                'maxlength': 60,
                'placeholder': 'Edit Task',
                'id': 'task',
                'class': inputClass
            });
            var editBtn = document.createElement('button');
            _this.setAttributes(editBtn, {
                'class': 'btn btn-default save-edit-' + task,
                'title': 'Save Edit',
                'id': 'btn'
            });
            var icon = document.createElement('i');
            icon.setAttribute('class', 'small material-icons save-edit-' + task);
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
            var cancel = document.getElementById('cancel-' + task);
            cancel.onclick = function () {
                taskToEdit.innerHTML = '';
                _this.taskSnippet(taskname, taskNo, taskToEdit);
            };
            input.onkeyup = function () {
                editedTask = input.value.trim();
                if (editedTask.length > 0) {
                    _this.editCookie(task, editedTask, taskNo, taskToEdit);
                }
                else {
                }
            };
        };
    };
    ToDo.prototype.setAttributes = function (el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };
    ToDo.prototype.editCookie = function (task, editedTask, taskNo, taskToEdit) {
        var _this = this;
        var saveBtn = document.getElementsByClassName('save-edit-' + task)[0];
        saveBtn.onclick = function () {
            taskToEdit.innerHTML = '';
            var editBox = document.getElementsByClassName('edit-' + task)[0];
            document.cookie = task + "=" + editedTask;
            _this.taskSnippet(editedTask, taskNo, taskToEdit);
        };
    };
    return ToDo;
}());
window.onload = function () {
    var task = document.getElementById('task');
    var add = document.getElementById('btn');
    var message = document.getElementById('message');
    var list = document.getElementsByClassName('list');
    var taskCountElm = document.getElementById('task-count');
    var todo = new ToDo(list, taskCountElm);
    task.onkeyup = function () {
        todo.getTask(task);
        add.onclick = function () {
            todo.addTask(list, message, task);
        };
        window.onmouseover = function () {
            if (list[0].childElementCount == 0) {
                list[0].innerHTML = "<small id='small'>Nothing at the moment</small>";
            }
        };
    };
    todo.deleteTask(list);
    todo.edit(list);
    window.onmouseover = function () {
        console.clear();
        var taskCount = todo.cookieLength();
        todo.taskCount(taskCountElm, taskCount, '(' + taskCount + ')');
    };
};
