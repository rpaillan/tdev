var clfn;
var clfn_active;
var clmn_mn;
var btn_prvs;
var btn_nxt;
var prtfl = 0;
var prtfl_images = 0;
var prtfl_current = 0;
var swap;

function init() {
	clfn = document.getElementById("cntnr_clfn");
	clfn_active = false;
	clmn_mn = document.getElementById("clmn_mn");
}

function init_prtfl(project, number, current) {
	btn_prvs = document.getElementById("btn_prvs");
	btn_nxt = document.getElementById("btn_nxt");
	prtfl = project
	prtfl_images = number;
	prtfl_current = current;
	if(prtfl_images > 1 && prtfl_current > 1) btn_prvs.className = "abs";
	if(prtfl_images > 1 && prtfl_current < prtfl_images) btn_nxt.className = "abs";
	change_image(current);
}

function slide_colofon() {
	if(clfn) {
		if(clfn_active) {
			clfn.className = "abs in";
			clfn_active = false;
		}
		else {
			clfn.className = "abs out";
			clfn_active = true;
		}
	}
}

function change_image_next() {
	change_image(prtfl_current + 1);
}

function change_image_previous() {
	change_image(prtfl_current - 1);
}

function change_image(current) {
	if(prtfl_images && current) {
		if(current > prtfl_images) current = prtfl_images;
		if(current < 1) current = 1;
		prtfl_current = current;
		clmn_mn.style.backgroundImage = "url('portfolio/" + prtfl + "/slide_" + prtfl_current + ".jpg')";
		if(prtfl_images > 1 && prtfl_current > 1) btn_prvs.className = "abs";
		else btn_prvs.className = "abs hidden";
		if(prtfl_images > 1 && prtfl_current < prtfl_images) btn_nxt.className = "abs";
		else btn_nxt.className = "abs hidden";
	}
}