module.exports = async function (req, res) {
    let errors = {};

    let projectName = req.param('project_name');
    let domainUrl = req.param('domain_url');
    //let domainMeta = req.param('domain_meta');
    //let domainUseFor = req.param('domain_use_for');

    if (!projectName) {
        errors.firstName = 'project_name field is required';
    }
    if (!domainUrl) {
        errors.lastName = 'domain_url field is required';
    }

    if (Object.keys(errors).length) {
        return res.status(422).json({errors: errors});
    }

    // await DomainMeta.updateOne({userId: req.me.id})
    //     .set({
    //         //firstName: firstName,
    //         //lastName: lastName
    //     });
    //
    // let domainWithMeta = await Domain.withMeta({id: req.me.id});
    //
    // //delete domainWithMeta.password;
    //
    // return res.status(200).json({
    //     domain: domainWithMeta
    // });

    return res.ok;
};
