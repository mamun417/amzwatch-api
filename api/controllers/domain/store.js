module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'domain_url': 'required',
        'project_name': 'required'
    })) return;

    let domainUrl = req.param('domain_url');
    let projectName = req.param('project_name');

    let domainInfo = await Domain.findOne({
        url: domainUrl,
    });

    if(domainInfo){
        let checkUserDomain = await UserDomain.findOne({
            domainId: domainInfo.id,
            userId: req.me.id
        });

        if (checkUserDomain){
            return res.status(422).json({
                errors:
                    {'message': 'this domain Url already used'}
            });
        }
    }

    if (!domainInfo){
        domainInfo = await Domain.create({
            url : domainUrl,
            domainStatus: {}
        }).fetch();

        let domainMeta = await DomainMeta.create({
            domainId: domainInfo.id,
            domainInfo: {}
        }).fetch();
    }

    let userDomain = await UserDomain.create({
        projectName: projectName,
        domainId: domainInfo.id,
        userId: req.me.id,
        domainUseFor: {}
    }).fetch();

    return res.status(200).json({
        domain : {
            domainId: domainInfo.id,
            domainUrl: domainInfo.url,
            projectName: userDomain.projectName,
        }
    });
};
