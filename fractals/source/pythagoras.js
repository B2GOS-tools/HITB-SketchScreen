
function Pythagoras(canvas_id,standalone){
	var i;
		var frac_apps, apps_copy, frac_apps2;
	// initialize the tree.

	var py = this;
	navigator.mozApps.mgmt.getAll().onsuccess = function(ev) { 

		var frac_apps2 = ev.target.result;
		py.frac_apps = frac_apps2;
		py.canvas = new Canvas(py,canvas_id);
		py.ctx = py.canvas.ctx;
		py.ctx.strokeStyle = 'black';
		py.ctx.fillStyle = 'black';
		py.ctx.lineCap = 'round';
	//800 / 530
	//320 / 480
	// /6     /4
		py.base_dim = py.canvas.width/4;
	
		py.ratio = 0.5*Math.sqrt(2);
	
		py.max_order = 9;
		py.order_colors = Gradient("#D4E576","#126845",py.max_order+2);
		py.min_order = 0;
		py.desired_order = 7;
	
		//initialize the different scales
		py.scales = [];
		for(i=py.min_order; i<=py.max_order; i++){
			py.scales[i] = Math.pow(py.ratio,i);
		}
	
		//stuff for asymentric stuff.
		py.max_percentage = 1;
		py.l_percentage = 1;
		py.r_percentage = 1;
	
	
		// actually initialize the canvas
		py.calcVariables();
		py.draw();
	}
}

Pythagoras.prototype = {
	update: function(pos){
		this.canvas.clear();
		this.updateOrder(pos);
		this.updateHorizontalPos(pos);
		this.calcVariables();
		this.draw();
	},
	updateOrder: function(pos){
		var min_y = this.canvas.height*0.1,
			max_y = this.canvas.height-(2*min_y),
			y = Math.min(max_y,Math.max(0, -(pos.y-(this.canvas.height-min_y)) ));
		this.desired_order = this.max_order*(y/max_y);
	},
	updateHorizontalPos: function(pos){
		var x = Math.min(1,Math.abs(pos.x - (this.canvas.half_width))/(this.canvas.half_width-(this.canvas.width*0.2)));
		x = ((this.max_percentage-0.5)*x) + 0.5;
		if(pos.x<(this.canvas.half_width)){ // we're on the right side.
			this.l_percentage = 1-x;
			this.r_percentage = x;
		}else{ //we're on the left.
			this.l_percentage = x;
			this.r_percentage = 1-x;
		}
	},
	draw: function(){
		
		//Refresh copy
		this.apps_copy = this.frac_apps.slice();
		// draw the trunk of the tree.
		this.ctx.save();

			this.ctx.translate((this.canvas.half_width)-(this.base_dim/2),this.canvas.height);

			//actually draw the trunk.
			this.ctx.fillStyle = this.order_colors[0];
			this.drawBranch(this.base_dim,this.base_dim);		
			
			//now draw the branches.
			this.ctx.save();
				this.ctx.translate(0,-this.base_dim);
				this.drawBranches(1);
			this.ctx.restore();		
			
		this.ctx.restore();
	},
	calcVariables: function(){
		
		var whole = Math.floor(this.desired_order),
			frac = this.desired_order - whole,
			lx = this.l_percentage*this.base_dim,
			rx = this.r_percentage*this.base_dim,
			temp=0, i;
		// change this thingy
		// calculate the final height first.
		this.height = this.base_dim*(Math.min(this.r_percentage, this.l_percentage));
		
		//calulate all the base variables.
		
		//now calculate the angles for either side.
		this.langle = Math.atan(this.height/lx);
		this.rangle = Math.atan(this.height/rx);
		
		//calculate the lengths of each side.
		temp = this.height*this.height;
		this.lwidth = Math.sqrt((lx*lx)+(temp));
		this.rwidth = Math.sqrt((rx*rx)+(temp));
		
		//calculate the scales for each side.
		temp = this.base_dim*this.ratio;
		this.rscale = this.rwidth/(temp);
		this.lscale = this.lwidth/(temp);
		
		//now calculate all of the inbetween values (base up to desired order);
		this.lwidths = [this.lwidth];
		this.rwidths = [this.rwidth];
		this.rx_trans = [this.base_dim*this.l_percentage];
		this.ry_trans = [-this.height];
		for(i=1; i<=this.max_order+1; i++){
			temp = this.scales[i-1];
			this.lwidths[i] = this.lwidth*temp;
			this.rwidths[i] = this.rwidth*temp;
			this.rx_trans[i] = lx*temp;
			this.ry_trans[i] = -this.height*temp;
		}
		
		// calculate the angles and lengths on the last partial iteration.
		this.final_height = this.height*frac*this.scales[whole];
		
		temp = lx*this.scales[whole];
		this.final_langle = Math.atan(this.final_height/temp);
		this.final_lwidth = Math.sqrt((temp*temp)+(this.final_height*this.final_height));
		this.final_lheight = this.final_lwidth*frac;
		
		temp = rx*this.scales[whole];
		this.final_rangle = Math.atan(this.final_height/temp);
		this.final_rwidth = Math.sqrt((temp*temp)+(this.final_height*this.final_height));
		this.final_rheight = this.final_rwidth*frac;
		
	},
	drawBranch: function(width, height){
		app =  this.apps_copy.pop(); //Get first app from list
		var py = this;
		if(app !== undefined && app.manifest.icons !== undefined && app.manifest.icons["30"] !== undefined) {
			var im = new Image();//document.createElement("img");
			im.src = app.origin + app.manifest.icons["30"];
console.log(im);
			im.onload = function() {
				
				var pattern = py.ctx.createPattern(im, "repeat");
				py.ctx.fillStyle = pattern;

				py.ctx.fillRect(0,-height,width,height);
			}
		}
		else {
			//this.ctx.fillStyle = this.order_colors[current_order];

		this.ctx.fillRect(0,-height,width,height);
		}
	},
	drawBranches: function(current_order){
		var next_order = current_order+1;
		
		//set the color to the current level.
		this.ctx.fillStyle = this.order_colors[current_order];
		
		//draw the left branch
		this.ctx.save();
			if(current_order > this.desired_order){
				//draw the special end.
				this.ctx.rotate(-this.final_langle);
				this.drawBranch(this.final_lwidth,this.final_lheight);
			}else{
				this.ctx.rotate(-this.langle);
				this.drawBranch(this.lwidths[current_order],this.lwidths[current_order]);
				this.ctx.save();
					this.ctx.translate(0,-this.lwidths[current_order]);
					this.ctx.scale(this.lscale,this.lscale);
					this.drawBranches(next_order);
				this.ctx.restore();
			}
		this.ctx.restore();
		
		
		
		//draw the right branch
		this.ctx.save();
			
			if(current_order > this.desired_order){
				//draw the special end.
				this.ctx.translate(this.rx_trans[current_order],-this.final_height);
				this.ctx.rotate(this.final_rangle);
				this.drawBranch(this.final_rwidth,this.final_rheight);
				
			}else{
				
				//draw the current branch
				this.ctx.translate(this.rx_trans[current_order],this.ry_trans[current_order]);
				this.ctx.rotate(this.rangle);
				this.drawBranch(this.rwidths[current_order],this.rwidths[current_order]);
				
				//draw the next one.
				this.ctx.save();
					this.ctx.translate(0,-this.rwidths[current_order]);
					this.ctx.scale(this.rscale,this.rscale);
					this.drawBranches(next_order);
				this.ctx.restore();
			}
		this.ctx.restore();
	}
};
