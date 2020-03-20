/*jshint esversion: 6 */
"use stirct";
let cy;

function readSingleFile(e) {
  let file = e.target.files[0];
  if(!file) {
    console.log('No file supplied');
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    cy.json(JSON.parse(contents));
    let element = document.getElementById('cy');
    let event = document.createEvent("HTMLEvents");
    event.initEvent("dataavailable", true, true);
    event.eventName = "dataavailable";
    element.dispatchEvent(event);
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", function() {
    cy = cytoscape({
      container: document.getElementById('cy'),
      style: [
        {
          selector: 'node',
          style: {
            'width': '400px',
            'height': '200px',
            'shape': 'roundrectangle'
          }
        }, {
          selector: 'node:selected',
          style: {
              "border-width": 2,
              "border-style": "solid",
              "border-color": "#3f3f3f",
              "border-opacity": 1,
              "background-color": "darkcyan"
          }
      }, {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'width': '6px',
            'target-arrow-shape': 'triangle',
            'control-point-step-size': '200px',
            'line-color': 'grey',
            'target-arrow-color': 'grey'
          }
        }
      ],
    });
  
    function panIn(target) {
      cy.animate({
        fit: {
          eles: target,
          padding: 200
        },
        duration: 700,
        easing: 'ease',
        queue: true
      });
    }

    document.getElementById('file-input').addEventListener('change', readSingleFile, false);

    const unseslectCurrent = () => {
      const current = cy.$('node:selected');
      current.incomers().animate({ style: { lineColor: "grey", targetArrowColor: "grey" } });
      current.outgoers().edges().animate({ style: { lineColor: "grey", targetArrowColor: "grey" } });
      cy.nodes().unselect();
    };

    const selectTarget = targetNode => {
      targetNode.select();
      targetNode.incomers().animate({ style: { lineColor: "red", targetArrowColor: "red" } });
      targetNode.outgoers().edges().animate({ style: { lineColor: "darkcyan", targetArrowColor: "darkcyan" } });
    };

    const switchToTargetNode = targetNode => {
      unseslectCurrent();
      selectTarget(targetNode);
      panIn(targetNode);
    };
  
    cy.on('tap', 'node', function(event) {
      const target = event.target;
      console.log('tap', target.data());
      const current = cy.$('node:selected');
      if(target.id() === current.id()) {
        window.open(target.data('link'), '_blank');
        return;
      }
      switchToTargetNode(target);
    });

    cy.on('tap', 'edge', function(event) {
      const edge = event.target.data();
      console.log('selected before', cy.$('node:selected'));
      const selectedNode = cy.$('node:selected').id() === edge.target ? cy.$id(edge.source) : cy.$id(edge.target);
      selectedNode.trigger('tap');
      console.log('selected after', cy.$('node:selected'));
    });


  
    document.getElementById('cy').addEventListener('dataavailable', function(e) {
      const startNode = cy.$('node[id ="http://www.hasolidit.com/15-%d7%a2%d7%a6%d7%95%d7%aa-%d7%a1%d7%95%d7%9c%d7%99%d7%93%d7%99%d7%95%d7%aa-%d7%9c%d7%91%d7%a0%d7%99-20"]');
      startNode.select();
      cy.layout({
        // name: 'dagre',
        name: 'circle',
        fit: false,
        // nodeDimensionsIncludeLabels: true,
        avoidOverlap: true,
        avoidOverlapPadding: 80,
      }).run();
      cy.nodeHtmlLabel([{
        'query': 'node',
        'valign': 'center',
        tpl: function(data) {
          return `<div class="cy-title" dir="rtl"> ${data.title} </div>`;
        }
      }]);
    
      cy.autolock(true);
      panIn(startNode);
    });

    const autoLock = document.getElementById('auto-lock');
    autoLock.addEventListener('click', () => {
      if(cy.autolock()) {
        autoLock.value = 'Lock in place';
        cy.autolock(false);

      } else {
        autoLock.value = 'Unlock';
        cy.autolock(true);
      }
    });

    document.getElementById('randomize').addEventListener('click', () => {
      cy.layout({
        name: 'random',
        fit: false,
        avoidOverlap: true,
        avoidOverlapPadding: 80,
      }).run();
    });
    
}); 