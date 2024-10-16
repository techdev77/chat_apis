

class GetConfig {

    getConfig = async (req, res, next) => {
                var response={
                    "success":true,
                    "profilePath":"",
                    "filePath":"",
                    "privacyPolicy":"",
                    "terms&Conditions":""
                }
        res.json(response);
    };

}

module.exports = new GetConfig;