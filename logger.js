const fs = require('fs');

const errorLogger = ({err, endpoint, method}) => {
    const content = {
        timestamp: new Date().toISOString(),
        error: err,
        endpoint: endpoint,
        method: method
    }
    
    fs.appendFile('errors.log', `${JSON.stringify(content)}\n`, (err) => {
        if(err){
            console.log("Could not append to logs file " + err);
        }
    })
}

module.exports = { errorLogger  }