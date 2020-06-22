import React,{Component , useRef} from 'react';
import socketIOClient from "socket.io-client";
import  '../Style/Style.css'
import arrow from '../images/up-arrow.png'

const ENDPOINT = "http://127.0.0.1:4000";


class Screen extends  Component
{

    constructor(props)
    {
        super(props);

        this.state ={
            altitude: 0,
            HSI : 0,
            ADI : 0,
            visual : 'graphic'
        };
        this.canvasRef = React.createRef();
        console.log('Constructor');
        
    }

    componentDidMount(){


        //region Connection for getting data

        // I open a socket to create the connection with the server
        console.log('New Connection');
        const socket = new socketIOClient(ENDPOINT);
        //when the server emits a Data message , I get the data and change my component's state
        socket.on("Data", data => {
            this.setState({altitude : data[0],HSI : data[1],ADI : data[2]});
        });

        //endregion

        // region Creating a clock
        // creation of the canvas
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        var radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.90;
        drawClock();


        /*
        Function to draw a clock
         */
        function drawClock() {


            drawface();
            drawnumbers();

        }

        /*
        Function for drawing the face of my clock
         */
        function drawface() {
            var grad;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();

            grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
            grad.addColorStop(0, '#333');
            grad.addColorStop(0.5, 'white');
            grad.addColorStop(1, '#333');
            ctx.strokeStyle = grad;
            ctx.lineWidth = radius*0.1;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, radius * 0, 0, 2 * Math.PI);
            ctx.fillStyle = '#333';
            ctx.fill();
        }


        /*
        Function for drawing  the  numbers on the clock
         */
        function drawnumbers() {
            var ang;
            var num;
            ctx.font = radius * 0.15 + "px arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            for(num = 0; num < 4; num++){
                ang = num * Math.PI / 2 ;
                console.log(num);
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.85);
                ctx.rotate(-ang);
                ctx.fillText((90*num).toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.85);
                ctx.rotate(-ang);
            }
        }

        //endregion



        console.log('Component');



    }


    /*
    Function to get the data with a  text representation
     */
    change_visualToText()
    {
       this.setState({visual : 'text'});
    }


    /*
    Function to get the data with a graphic representation
     */
    change_visualToGraphic() {
        this.setState({visual : 'graphic'});
    }





    render()
    {

        console.log('render');
        const data = this.state;



        //  region Manage the  ADI parameter

        console.log("ADI : " +data.ADI );
        let blue = "50%";
        let green = "50%";
        if(data.ADI > 0  ) {
            blue = (data.ADI / 2 + 53).toString() + "%";
            green = (100 - (data.ADI / 2 + 47)).toString() + "%";
        }
        else
        {
            green = ((-data.ADI) / 2 + 53).toString() + "%" ;
            blue = (100 - ((-data.ADI) / 2 + 47)).toString() + "%";
        }
        console.log(blue);
        console.log(green);
        //endregion






        //  region Manage the altitude parameter
        console.log("Altitude : " +data.altitude );
        let altitude = (300 -data.altitude/10).toString()+"px";
        console.log(altitude);
        //endregion

        // region Manage the HSI parameter
        console.log("HSI: " +data.HSI );
        let angle = 'rotate'+ '(' + data.HSI.toString() + 'deg)';
        console.log(angle);
        //endregion

        return(

            <div >

               <h1>Welcome to your data screen  </h1>

                <div className="container">
                    <div className="button_container">
                        <button className="button" id="text_btn"  onClick={this.change_visualToText.bind(this)}  >Text</button>
                        <button  className="button" id="visual_btn"  onClick={this.change_visualToGraphic.bind(this)} >Visual</button>
                    </div>
                    <div className="text_container" style={{ display : this.state.visual == 'text' ? "flex" : "none"}}>

                        <div className="card">
                            <div className="card-header">Altitude:</div>
                            <div className="card-body"> {this.state.altitude} M </div>
                        </div>

                        <div className="card">
                            <div className="card-header"> HSI</div>
                            <div className="card-body"> {this.state.HSI}  </div>
                        </div>

                        <div className="card">
                            <div className="card-header">ADI:</div>
                            <div className="card-body"> {this.state.ADI} deg  </div>
                        </div>

                    </div>
                    <div className="graphic_container" style={ { display : this.state.visual == 'graphic' ? "flex" : "none"} }>
                        <div className="altitude_container">
                          <div className="bar">
                              <hr style = {{ marginTop:  altitude }}/>
                              <div className="bar-value">
                                  <li id="3000">3000</li>
                                  <li id="2000">2000</li>
                                  <li id="1000">1000</li>
                                  <li id="0">0</li>

                              </div>
                          </div>
                        </div>
                        <div className="HSI_container">
                            <canvas ref={this.canvasRef} width={300} height={300} style={{ backgroundcolor: 'white', transform : angle }}  ></canvas>
                            <div>
                                <img className='arrow-img' src={arrow}/>
                            </div>
                        </div>
                        <div className="ADI_container">
                            <div className="circle" >
                                <div className="green" style={{ width : green}}></div>
                                <div className="blue" style={{ width : blue}}></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


}

export default Screen;